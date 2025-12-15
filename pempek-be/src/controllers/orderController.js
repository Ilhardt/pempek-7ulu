const db = require("../config/database");

// Create new order - STOCK BELUM DIKURANGI (tunggu konfirmasi admin)
exports.createOrder = async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const {
      customer_name,
      customer_phone,
      customer_address,
      items,
      total_price,
      notes,
    } = req.body;

    console.log('📦 Creating order with', items.length, 'items');

    // ✅ HANYA VALIDASI stock cukup (BELUM dikurangi)
    for (const item of items) {
      const [product] = await connection.query(
        'SELECT id, name, stock FROM menu_items WHERE id = ?',
        [item.menu_item_id]
      );

      if (product.length === 0) {
        throw new Error(`Produk dengan ID ${item.menu_item_id} tidak ditemukan`);
      }

      const currentStock = product[0].stock;
      console.log(`📊 ${product[0].name}: Stock tersedia = ${currentStock}, Dipesan = ${item.quantity}`);

      // Validasi stock cukup
      if (currentStock < item.quantity) {
        throw new Error(`Stock ${product[0].name} tidak cukup! Tersedia: ${currentStock}, Dipesan: ${item.quantity}`);
      }

      console.log(`✅ ${product[0].name}: Stock cukup (belum dikurangi, menunggu konfirmasi admin)`);
    }

    // Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
       (customer_name, customer_phone, customer_address, total_price, notes, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [customer_name, customer_phone, customer_address, total_price, notes]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items 
         (order_id, menu_item_id, quantity, price, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.menu_item_id,
          item.quantity,
          item.price,
          item.notes || null,
        ]
      );
    }

    await connection.commit();

    console.log(`✅ Order #${orderId} created successfully (stock belum dikurangi)`);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { order_id: orderId },
    });
  } catch (error) {
    await connection.rollback();
    console.error("❌ Error creating order:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create order",
    });
  } finally {
    connection.release();
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, 
             COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get order details
    const [orders] = await db.query("SELECT * FROM orders WHERE id = ?", [id]);

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Get order items
    const [items] = await db.query(
      `
      SELECT oi.*, mi.name as menu_name, mi.image
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `,
      [id]
    );

    res.json({
      success: true,
      data: {
        ...orders[0],
        items,
      },
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order",
    });
  }
};

// Update order status (Admin) - STOCK BERKURANG SAAT KONFIRMASI
exports.updateOrderStatus = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { id } = req.params;
    const { status } = req.body;

    // Status yang valid sesuai dengan flow bisnis
    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "ready",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status. Valid statuses: " + validStatuses.join(", "),
      });
    }

    // Get current order status
    const [currentOrder] = await connection.query(
      'SELECT status FROM orders WHERE id = ?',
      [id]
    );

    if (currentOrder.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    const oldStatus = currentOrder[0].status;

    await connection.beginTransaction();

    // ✅ KURANGI STOCK saat admin KONFIRMASI pembayaran (pending → confirmed)
    if (oldStatus === 'pending' && status === 'confirmed') {
      console.log(`✅ Order #${id} DIKONFIRMASI - Mengurangi stock...`);

      // Get order items
      const [items] = await connection.query(
        `SELECT oi.menu_item_id, oi.quantity, mi.name, mi.stock
         FROM order_items oi
         JOIN menu_items mi ON oi.menu_item_id = mi.id
         WHERE oi.order_id = ?`,
        [id]
      );

      // Validasi dan kurangi stock untuk setiap item
      for (const item of items) {
        // Cek stock masih cukup (bisa saja sudah berkurang karena order lain)
        if (item.stock < item.quantity) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            error: `Stock ${item.name} tidak cukup! Tersedia: ${item.stock}, Dibutuhkan: ${item.quantity}`,
          });
        }

        // Kurangi stock
        const [result] = await connection.query(
          'UPDATE menu_items SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.menu_item_id]
        );

        if (result.affectedRows > 0) {
          console.log(`✅ Stock ${item.name} dikurangi: ${item.stock} → ${item.stock - item.quantity}`);
        }
      }
    }

    // ✅ KEMBALIKAN STOCK jika admin TOLAK pembayaran (pending → cancelled)
    // ATAU jika order yang sudah confirmed dibatalkan (confirmed → cancelled)
    if (status === 'cancelled' && (oldStatus === 'confirmed' || oldStatus === 'processing' || oldStatus === 'ready')) {
      console.log(`🔄 Order #${id} DIBATALKAN - Mengembalikan stock...`);

      // Get order items
      const [items] = await connection.query(
        `SELECT oi.menu_item_id, oi.quantity, mi.name 
         FROM order_items oi
         JOIN menu_items mi ON oi.menu_item_id = mi.id
         WHERE oi.order_id = ?`,
        [id]
      );

      // Kembalikan stock untuk setiap item
      for (const item of items) {
        const [result] = await connection.query(
          'UPDATE menu_items SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.menu_item_id]
        );

        if (result.affectedRows > 0) {
          console.log(`✅ Stock ${item.name} dikembalikan: +${item.quantity}`);
        }
      }
    }

    // Jika cancel dari pending → cancelled, stock TIDAK perlu dikembalikan
    // (karena belum pernah dikurangi)
    if (status === 'cancelled' && oldStatus === 'pending') {
      console.log(`ℹ️ Order #${id} DITOLAK dari pending - Stock tidak berubah (belum pernah dikurangi)`);
    }

    // Update order status
    const [result] = await connection.query(
      "UPDATE orders SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );

    await connection.commit();

    console.log(`✅ Order #${id} status updated: ${oldStatus} → ${status}`);

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: { 
        old_status: oldStatus,
        new_status: status 
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update order status",
    });
  } finally {
    connection.release();
  }
};

// Upload payment proof
exports.uploadPaymentProof = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_proof } = req.body;

    console.log("📤 ===== UPLOAD PAYMENT PROOF START =====");
    console.log("🆔 Order ID:", id);
    console.log("📦 Request body keys:", Object.keys(req.body));
    console.log("❓ Payment proof exists?", !!payment_proof);

    if (payment_proof) {
      console.log(
        "📏 Payment proof length:",
        payment_proof.length,
        "characters"
      );
      console.log("🔍 First 100 chars:", payment_proof.substring(0, 100));
      console.log(
        "📊 Size estimate:",
        (payment_proof.length / 1024).toFixed(2),
        "KB"
      );
    }

    // Validasi payment_proof ada
    if (!payment_proof) {
      console.log("❌ Payment proof is empty!");
      return res.status(400).json({
        success: false,
        error: "Payment proof is required",
      });
    }

    // Validasi format base64
    if (!payment_proof.startsWith("data:image/")) {
      console.log("⚠️ Warning: Payment proof does not start with data:image/");
      console.log("First 50 chars:", payment_proof.substring(0, 50));
    }

    console.log("🔄 Executing UPDATE query...");
    const [result] = await db.query(
      "UPDATE orders SET payment_proof = ?, updated_at = NOW() WHERE id = ?",
      [payment_proof, id]
    );

    console.log("📋 Query result:", {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows,
      warningCount: result.warningCount,
    });

    if (result.affectedRows === 0) {
      console.log("❌ No rows updated - Order not found");
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // VERIFY: Cek apakah data benar-benar tersimpan
    console.log("✅ Verifying saved data...");
    const [checkOrder] = await db.query(
      "SELECT id, payment_proof IS NOT NULL as has_proof, LENGTH(payment_proof) as proof_length FROM orders WHERE id = ?",
      [id]
    );

    if (checkOrder.length > 0) {
      console.log("📊 Verification result:", {
        order_id: checkOrder[0].id,
        has_proof: checkOrder[0].has_proof,
        proof_length: checkOrder[0].proof_length,
      });

      if (!checkOrder[0].has_proof || checkOrder[0].proof_length === 0) {
        console.log("❌ CRITICAL: Data was NOT saved to database!");
        console.log("⚠️ Check if column type is LONGTEXT");
        return res.status(500).json({
          success: false,
          error: "Payment proof was not saved. Please contact admin.",
          debug: {
            has_proof: checkOrder[0].has_proof,
            proof_length: checkOrder[0].proof_length,
            hint: "Database column might be too small (use LONGTEXT)",
          },
        });
      }
    }

    console.log("✅ ===== UPLOAD PAYMENT PROOF SUCCESS =====");

    res.json({
      success: true,
      message: "Payment proof uploaded successfully",
      data: {
        order_id: id,
        payment_proof_uploaded: true,
        proof_size: payment_proof.length,
      },
    });
  } catch (error) {
    console.error("❌ ===== UPLOAD PAYMENT PROOF ERROR =====");
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
    });

    res.status(500).json({
      success: false,
      error: "Failed to upload payment proof",
      details: error.message,
      sqlError: error.sqlMessage,
    });
  }
};

// Get orders by customer phone
exports.getOrdersByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    console.log("📞 Fetching orders for phone:", phone);

    if (!phone) {
      return res.status(400).json({
        success: false,
        error: "Phone number is required",
      });
    }

    // Get all orders untuk phone number ini
    const [orders] = await db.query(
      `
      SELECT 
        o.id,
        o.customer_name,
        o.customer_phone,
        o.customer_address,
        o.total_price,
        o.status,
        o.notes,
        o.payment_proof,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.customer_phone = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `,
      [phone]
    );

    console.log("✅ Found", orders.length, "orders");

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders by phone:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
};
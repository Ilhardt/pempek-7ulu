const supabase = require("../config/database");

// Create new order - STOCK BELUM DIKURANGI (tunggu konfirmasi admin)
exports.createOrder = async (req, res) => {
  try {
    const {
      customer_name,
      customer_phone,
      customer_address,
      items,
      total_price,
      notes,
    } = req.body;

    console.log("📦 Creating order with", items.length, "items");

    // ✅ HANYA VALIDASI stock cukup (BELUM dikurangi)
    for (const item of items) {
      const { data: product, error } = await supabase
        .from("menu_items")
        .select("id, name, stock")
        .eq("id", item.menu_item_id)
        .single();

      if (error || !product) {
        throw new Error(
          `Produk dengan ID ${item.menu_item_id} tidak ditemukan`
        );
      }

      const currentStock = product.stock;
      console.log(
        `📊 ${product.name}: Stock tersedia = ${currentStock}, Dipesan = ${item.quantity}`
      );

      // Validasi stock cukup
      if (currentStock < item.quantity) {
        throw new Error(
          `Stock ${product.name} tidak cukup! Tersedia: ${currentStock}, Dipesan: ${item.quantity}`
        );
      }

      console.log(
        `✅ ${product.name}: Stock cukup (belum dikurangi, menunggu konfirmasi admin)`
      );
    }

    // Insert order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_phone,
        customer_address,
        total_price,
        notes,
        status: "pending",
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderId = orderData.id;

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: orderId,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes || null,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    console.log(
      `✅ Order #${orderId} created successfully (stock belum dikurangi)`
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: { order_id: orderId },
    });
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create order",
    });
  }
};

// Get all orders (Admin)
exports.getAllOrders = async (req, res) => {
  try {
    // Get all orders with item count
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(count)
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Format response to match original structure
    const formattedOrders = orders.map((order) => ({
      ...order,
      item_count: order.order_items?.[0]?.count || 0,
    }));

    res.json({
      success: true,
      data: formattedOrders,
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

    // Get order details with items
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(
          *,
          menu_items(name, image)
        )
      `
      )
      .eq("id", id)
      .single();

    if (orderError || !order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // Format items to match original structure
    const items =
      order.order_items?.map((item) => ({
        ...item,
        menu_name: item.menu_items?.name,
        image: item.menu_items?.image,
      })) || [];

    res.json({
      success: true,
      data: {
        ...order,
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
    const { data: currentOrder, error: orderError } = await supabase
      .from("orders")
      .select("status")
      .eq("id", id)
      .single();

    if (orderError || !currentOrder) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    const oldStatus = currentOrder.status;

    // ✅ KURANGI STOCK saat admin KONFIRMASI pembayaran (pending → confirmed)
    if (oldStatus === "pending" && status === "confirmed") {
      console.log(`✅ Order #${id} DIKONFIRMASI - Mengurangi stock...`);

      // Get order items with menu details
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select(
          `
          menu_item_id,
          quantity,
          menu_items(name, stock)
        `
        )
        .eq("order_id", id);

      if (itemsError) throw itemsError;

      // Validasi dan kurangi stock untuk setiap item
      for (const item of items) {
        const menuItem = item.menu_items;

        // Cek stock masih cukup
        if (menuItem.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            error: `Stock ${menuItem.name} tidak cukup! Tersedia: ${menuItem.stock}, Dibutuhkan: ${item.quantity}`,
          });
        }

        // Kurangi stock
        const { error: updateError } = await supabase
          .from("menu_items")
          .update({ stock: menuItem.stock - item.quantity })
          .eq("id", item.menu_item_id);

        if (updateError) throw updateError;

        console.log(
          `✅ Stock ${menuItem.name} dikurangi: ${menuItem.stock} → ${
            menuItem.stock - item.quantity
          }`
        );
      }
    }

    // ✅ KEMBALIKAN STOCK jika order dibatalkan setelah confirmed
    if (
      status === "cancelled" &&
      ["confirmed", "processing", "ready"].includes(oldStatus)
    ) {
      console.log(`🔄 Order #${id} DIBATALKAN - Mengembalikan stock...`);

      // Get order items with menu details
      const { data: items, error: itemsError } = await supabase
        .from("order_items")
        .select(
          `
          menu_item_id,
          quantity,
          menu_items(name, stock)
        `
        )
        .eq("order_id", id);

      if (itemsError) throw itemsError;

      // Kembalikan stock untuk setiap item
      for (const item of items) {
        const menuItem = item.menu_items;

        const { error: updateError } = await supabase
          .from("menu_items")
          .update({ stock: menuItem.stock + item.quantity })
          .eq("id", item.menu_item_id);

        if (updateError) throw updateError;

        console.log(
          `✅ Stock ${menuItem.name} dikembalikan: +${item.quantity}`
        );
      }
    }

    // Jika cancel dari pending → cancelled, stock TIDAK perlu dikembalikan
    if (status === "cancelled" && oldStatus === "pending") {
      console.log(
        `ℹ️ Order #${id} DITOLAK dari pending - Stock tidak berubah (belum pernah dikurangi)`
      );
    }

    // Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) throw updateError;

    console.log(`✅ Order #${id} status updated: ${oldStatus} → ${status}`);

    res.json({
      success: true,
      message: "Order status updated successfully",
      data: {
        old_status: oldStatus,
        new_status: status,
      },
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update order status",
    });
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
    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_proof,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      console.log("❌ No rows updated - Order not found");
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // VERIFY: Cek apakah data benar-benar tersimpan
    console.log("✅ Verifying saved data...");
    const { data: checkOrder, error: checkError } = await supabase
      .from("orders")
      .select("id, payment_proof")
      .eq("id", id)
      .single();

    if (checkError) throw checkError;

    if (!checkOrder.payment_proof) {
      console.log("❌ CRITICAL: Data was NOT saved to database!");
      return res.status(500).json({
        success: false,
        error: "Payment proof was not saved. Please contact admin.",
        debug: {
          has_proof: !!checkOrder.payment_proof,
          hint: "Database column might be too small (use TEXT type)",
        },
      });
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
    console.error("Error details:", error);

    res.status(500).json({
      success: false,
      error: "Failed to upload payment proof",
      details: error.message,
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

    // Get all orders with item count
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items(count)
      `
      )
      .eq("customer_phone", phone)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Format response
    const formattedOrders = orders.map((order) => ({
      ...order,
      item_count: order.order_items?.[0]?.count || 0,
    }));

    console.log("✅ Found", formattedOrders.length, "orders");

    res.json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching orders by phone:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
  }
};

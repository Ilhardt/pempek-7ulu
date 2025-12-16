// PEMPEK-BE/src/controllers/menuController.js
const db = require("../config/database");

// Get all menu items (active only - for public/customer)
exports.getAllMenu = async (req, res) => {
  try {
    // PostgreSQL pakai TRUE instead of 1
    const result = await db.query(
      "SELECT id, name, price, stock, description, image, is_active, created_at, updated_at FROM menu_items WHERE is_active = TRUE ORDER BY id ASC"
    );

    // PostgreSQL result ada di .rows
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch menu items",
      details: error.message,
    });
  }
};

// Get ALL menu items including inactive (for admin)
exports.getAllMenuAdmin = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, name, price, stock, description, image, is_active, created_at, updated_at FROM menu_items ORDER BY id ASC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching all menu:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch all menu items",
      details: error.message,
    });
  }
};

// Get single menu item
exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    // PostgreSQL pakai $1, $2 untuk parameters (bukan ?)
    const result = await db.query(
      "SELECT * FROM menu_items WHERE id = $1 AND is_active = TRUE",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch menu item",
      details: error.message,
    });
  }
};

// Create menu item (Admin only)
exports.createMenu = async (req, res) => {
  try {
    const { name, price, stock, description, image } = req.body;

    // Validation
    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        error: "Name, price, and stock are required",
      });
    }

    // PostgreSQL pakai RETURNING untuk get inserted ID
    const result = await db.query(
      "INSERT INTO menu_items (name, price, stock, description, image, is_active) VALUES ($1, $2, $3, $4, $5, TRUE) RETURNING id",
      [
        name,
        parseFloat(price),
        parseInt(stock),
        description || null,
        image || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Error creating menu:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create menu item",
      details: error.message,
    });
  }
};

// Update menu item (Admin only)
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, stock, description, image, is_active } = req.body;

    // Validation
    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        error: "Name, price, and stock are required",
      });
    }

    console.log("Updating product:", id, "with data:", {
      name,
      price,
      stock,
      description,
      image,
      is_active,
    });

    // PostgreSQL pakai NOW() dan $1, $2, etc
    const result = await db.query(
      "UPDATE menu_items SET name = $1, price = $2, stock = $3, description = $4, image = $5, is_active = $6, updated_at = NOW() WHERE id = $7",
      [
        name,
        parseFloat(price),
        parseInt(stock),
        description || null,
        image || null,
        is_active !== undefined ? is_active : true,
        id,
      ]
    );

    console.log("Update result:", result);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item updated successfully",
    });
  } catch (error) {
    console.error("Error updating menu:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update menu item",
    });
  }
};

// Delete menu item (Admin only) - Hard delete
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // Hard delete - benar-benar hapus dari database
    const result = await db.query("DELETE FROM menu_items WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
    }

    res.json({
      success: true,
      message: "Menu item permanently deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting menu:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete menu item",
    });
  }
};
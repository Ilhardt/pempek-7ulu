const supabase = require("../config/database");

// Get all menu items (active only - for public/customer)
exports.getAllMenu = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('id, name, price, stock, description, image, is_active, created_at, updated_at')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) throw error;

    res.json(data);
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
    const { data, error } = await supabase
      .from('menu_items')
      .select('id, name, price, stock, description, image, is_active, created_at, updated_at')
      .order('id', { ascending: true });

    if (error) throw error;

    res.json(data);
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
    
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
    }

    res.json(data);
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

    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        error: "Name, price, and stock are required",
      });
    }

    const { data, error } = await supabase
      .from('menu_items')
      .insert([{
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        description: description || null,
        image: image || null,
        is_active: true
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      id: data.id,
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

    if (!name || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        error: "Name, price, and stock are required",
      });
    }

    console.log("Updating product:", id, "with data:", {
      name, price, stock, description, image, is_active
    });

    const { data, error } = await supabase
      .from('menu_items')
      .update({
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        description: description || null,
        image: image || null,
        is_active: is_active !== undefined ? is_active : true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
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

    const { data, error } = await supabase
      .from('menu_items')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
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

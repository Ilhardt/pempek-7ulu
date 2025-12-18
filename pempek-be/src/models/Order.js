// models/Order.js
const supabase = require("../config/database");

router.patch("/:id/payment-proof", async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_proof } = req.body;

    console.log("Received payment proof upload for order:", id);

    const { data, error } = await supabase
      .from("orders")
      .update({ payment_proof })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Update error:", error);
      throw error;
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    res.json({
      success: true,
      message: "Payment proof uploaded successfully",
      data: data,
    });
  } catch (error) {
    console.error("Upload payment proof error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Backend: routes/orders.js
router.patch('/:id/payment-proof', async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_proof } = req.body;

    console.log('Received payment proof upload for order:', id);

    const result = await db.query(
      'UPDATE orders SET payment_proof = $1 WHERE id = $2 RETURNING *',
      [payment_proof, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Order not found' 
      });
    }

    res.json({
      success: true,
      message: 'Payment proof uploaded successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Upload payment proof error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});
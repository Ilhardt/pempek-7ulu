// controllers/businessInfoController.js
const BusinessInfo = require('../models/BusinessInfo');

class BusinessInfoController {
  // GET /api/business-info
  static async getBusinessInfo(req, res) {
    try {
      const businessInfo = await BusinessInfo.get();
      
      res.status(200).json({
        success: true,
        data: businessInfo
      });
    } catch (error) {
      console.error('Error getting business info:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal mengambil informasi usaha',
        error: error.message
      });
    }
  }

  // PUT /api/business-info
  static async updateBusinessInfo(req, res) {
    try {
      const { business_name, address, contact_1, contact_2, qris_image, operating_hours } = req.body;
      
      if (!address || !contact_1) {
        return res.status(400).json({
          success: false,
          message: 'Alamat dan Kontak 1 wajib diisi'
        });
      }

      const data = {
        business_name: business_name || 'Pempek 7 Ulu',
        address,
        contact_1,
        contact_2: contact_2 || null,
        qris_image: qris_image || null,
        operating_hours: operating_hours || 'Setiap Hari\n09:00 - 20:00 WIB'
      };

      await BusinessInfo.update(data);

      res.status(200).json({
        success: true,
        message: 'Informasi usaha berhasil diperbarui'
      });
    } catch (error) {
      console.error('Error updating business info:', error);
      res.status(500).json({
        success: false,
        message: 'Gagal memperbarui informasi usaha',
        error: error.message
      });
    }
  }
}

module.exports = BusinessInfoController; // ⭐ Pastikan ini ada
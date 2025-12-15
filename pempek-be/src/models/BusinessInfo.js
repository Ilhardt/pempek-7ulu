// models/BusinessInfo.js
const db = require('../config/database');

class BusinessInfo {
  // Get business info (hanya ada 1 record)
  static async get() {
    try {
      const [rows] = await db.query(
        'SELECT * FROM business_info LIMIT 1'
      );
      
      if (rows.length === 0) {
        // Return default values jika belum ada data
        return {
          business_name: 'Pempek 7 Ulu',
          address: 'Jl. Rawamangun Selatan No 3 7, RT 7/RW.15, Rawamangun, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13220',
          contact_1: '+62-855-7694-746',
          contact_2: '+62-856-9386-4879',
          qris_image: null,
          operating_hours: 'Setiap Hari\n09:00 - 20:00 WIB'
        };
      }
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Update business info
  static async update(data) {
    try {
      const { business_name, address, contact_1, contact_2, qris_image, operating_hours } = data;
      
      // Check if record exists
      const [existing] = await db.query('SELECT id FROM business_info LIMIT 1');
      
      if (existing.length === 0) {
        // Insert new record
        const [result] = await db.query(
          `INSERT INTO business_info 
          (business_name, address, contact_1, contact_2, qris_image, operating_hours) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [business_name, address, contact_1, contact_2, qris_image, operating_hours]
        );
        return result;
      } else {
        // Update existing record
        const [result] = await db.query(
          `UPDATE business_info 
          SET business_name = ?, address = ?, contact_1 = ?, contact_2 = ?, 
              qris_image = ?, operating_hours = ?, updated_at = NOW()
          WHERE id = ?`,
          [business_name, address, contact_1, contact_2, qris_image, operating_hours, existing[0].id]
        );
        return result;
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BusinessInfo;
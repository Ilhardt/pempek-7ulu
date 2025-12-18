// models/BusinessInfo.js
const supabase = require('../config/database');

class BusinessInfo {
  // Get business info (hanya ada 1 record)
  static async get() {
    try {
      const { data, error } = await supabase
        .from('business_info')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        // Jika tidak ada data, return default values
        if (error.code === 'PGRST116') {
          return {
            business_name: 'Pempek 7 Ulu',
            address: 'Jl. Rawamangun Selatan No 3 7, RT 7/RW.15, Rawamangun, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13220',
            contact_1: '+62-855-7694-746',
            contact_2: '+62-856-9386-4879',
            qris_image: null,
            operating_hours: 'Setiap Hari\n09:00 - 20:00 WIB'
          };
        }
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Update business info
  static async update(data) {
    try {
      const { business_name, address, contact_1, contact_2, qris_image, operating_hours } = data;

      // Check if record exists
      const { data: existing, error: checkError } = await supabase
        .from('business_info')
        .select('id')
        .limit(1)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (!existing) {
        // Insert new record
        const { data: insertData, error: insertError } = await supabase
          .from('business_info')
          .insert({
            business_name,
            address,
            contact_1,
            contact_2,
            qris_image,
            operating_hours
          })
          .select()
          .single();

        if (insertError) throw insertError;
        return insertData;
      } else {
        // Update existing record
        const { data: updateData, error: updateError } = await supabase
          .from('business_info')
          .update({
            business_name,
            address,
            contact_1,
            contact_2,
            qris_image,
            operating_hours,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (updateError) throw updateError;
        return updateData;
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = BusinessInfo;
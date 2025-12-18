// app/kontak/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/customer/navbar";
import ContactHeader from "../../components/customer/kontak/contactHeader";
import ContactInfo from "../../components/customer/kontak/contactInfo";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface BusinessInfo {
  address: string;
  contact_1: string;
  contact_2: string;
  operating_hours: string;
}

export default function KontakPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    address: 'Jl. Rawamangun Selatan No.3 7, RT.7/RW.15, Rawamangun, Kec. Pulo Gadung, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13230',
    contact_1: '+62-855-7694-746',
    contact_2: '+62-856-9386-4879',
    operating_hours: 'Setiap Hari\n09:00 - 20:00 WIB'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBusinessInfo();
  }, []);

  const fetchBusinessInfo = async () => {
    try {
      const response = await fetch(`${API_URL}/business-info`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setBusinessInfo(result.data);
      }
    } catch (error) {
      console.error('Error fetching business info:', error);
      // Tetap gunakan data default jika gagal fetch
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 min-h-screen relative">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(https://i.imgur.com/SKNtATJ.jpeg)",
            backgroundColor: "#f5f5f5",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 min-h-screen flex items-center">
          <div className="w-full">
            <div className="space-y-8">
              <ContactHeader />
              
              {loading ? (
                <div className="text-white text-lg">Memuat informasi kontak...</div>
              ) : (
                <ContactInfo
                  contact1={businessInfo.contact_1}
                  contact2={businessInfo.contact_2}
                  operatingHours={businessInfo.operating_hours}
                  address={businessInfo.address}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
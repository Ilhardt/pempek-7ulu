"use client";

import React, { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";

interface QRCodeSectionProps {
  orderId: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api";

export default function QRCodeSection({ orderId }: QRCodeSectionProps) {
  const [qrisImage, setQrisImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasQRCode, setHasQRCode] = useState(false);

  useEffect(() => {
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    try {
      const response = await fetch(`${API_URL}/business-info`);
      const result = await response.json();
      
      if (result.success && result.data && result.data.qris_image) {
        setQrisImage(result.data.qris_image);
        setHasQRCode(true);
      } else {
        setHasQRCode(false);
      }
    } catch (error) {
      console.error('Error fetching QR code:', error);
      setHasQRCode(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 mb-8">
      <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-gray-200 overflow-hidden">
        <div className="w-64 h-64 relative overflow-hidden flex items-center justify-center bg-gray-50">
          {loading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
              <p className="text-sm text-gray-600">Memuat QR Code...</p>
            </div>
          ) : hasQRCode && qrisImage ? (
            <img 
              src={qrisImage}
              alt="QR Code Pembayaran"
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="text-center p-6">
              <AlertCircle className="w-16 h-16 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-semibold mb-2">QR Code Belum Tersedia</p>
              <p className="text-sm text-gray-500">Admin belum mengupload QRIS</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <p className="text-gray-600 text-sm mb-1">ORDER ID</p>
        <p className="text-gray-900 font-mono font-bold text-lg tracking-wider">
          {orderId}
        </p>
      </div>

      {!loading && !hasQRCode && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 max-w-md">
          <p className="text-sm text-amber-800 text-center">
            ⚠️ <strong>QR Code belum tersedia.</strong><br/>
            Silakan gunakan opsi <strong>"Konfirmasi via WhatsApp"</strong> di bawah untuk pembayaran alternatif.
          </p>
        </div>
      )}

      {!loading && hasQRCode && qrisImage && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 max-w-md">
          <p className="text-sm text-blue-800 text-center">
            📱 <strong>Scan QR Code</strong> menggunakan aplikasi e-wallet Anda (GoPay, OVO, DANA, ShopeePay, dll)
          </p>
        </div>
      )}
    </div>
  );
}
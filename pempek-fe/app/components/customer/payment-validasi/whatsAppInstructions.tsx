// components/customer/payment-validasi/WhatsAppInstructions.tsx
import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppInstructions() {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
      <h3 className="font-bold text-blue-900 text-lg mb-3 flex items-center gap-2">
        <MessageCircle className="w-5 h-5" />
        Langkah Selanjutnya
      </h3>
      <ol className="list-decimal list-inside space-y-2 text-blue-800">
        <li>Klik tombol "Hubungi Admin untuk Metode Alternatif" di bawah</li>
        <li>Konfirmasi pembayaran Anda ke admin</li>
        <li>Tunggu admin mengkonfirmasi pesanan Anda</li>
      </ol>
    </div>
  );
}
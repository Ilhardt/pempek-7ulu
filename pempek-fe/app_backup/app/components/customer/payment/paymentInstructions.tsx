"use client";

import React from "react";

interface PaymentInstructionsProps {
  totalPrice: number;
  formatPrice: (price: number) => string;
}

export default function PaymentInstructions({
  totalPrice,
  formatPrice,
}: PaymentInstructionsProps) {
  return (
    <div className="mt-8 p-6 bg-amber-50 rounded-2xl border-2 border-amber-200">
      <h3 className="font-bold text-gray-900 mb-3 text-lg">📋 Cara Pembayaran:</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
        <li>Scan QR Code di atas menggunakan aplikasi e-wallet Anda</li>
        <li>Masukkan nominal pembayaran: <span className="font-bold text-red-600">{formatPrice(totalPrice)}</span></li>
        <li>Screenshot bukti transfer dan upload di form di atas</li>
        <li>Pilih <span className="font-semibold">"Konfirmasi via WhatsApp"</span> untuk verifikasi cepat atau <span className="font-semibold">"Lanjutkan"</span> untuk melanjutkan tanpa WhatsApp</li>
        <li>Tunggu konfirmasi dari admin kami</li>
      </ol>
    </div>
  );
}
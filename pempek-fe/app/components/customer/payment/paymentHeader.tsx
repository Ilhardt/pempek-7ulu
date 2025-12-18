"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

interface PaymentHeaderProps {
  onBack: () => void;
  orderId: string;
}

export default function PaymentHeader({ onBack, orderId }: PaymentHeaderProps) {
  const handleBack = () => {
    // ⭐ Konfirmasi sebelum cancel order
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin membatalkan pesanan ini?"
    );

    if (confirmed) {
      onBack();
    }
  };

  return (
    <div className="flex items-center gap-6 mb-8">
      <button
        onClick={handleBack}
        className="p-3 hover:bg-gray-100 rounded-full transition-colors"
        title="Batalkan pesanan dan kembali"
      >
        <ArrowLeft className="w-8 h-8 text-gray-700" />
      </button>
      
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Pembayaran</h1>
        <p className="text-sm text-gray-600 mt-1">
          Order #{orderId}
        </p>
      </div>
    </div>
  );
}
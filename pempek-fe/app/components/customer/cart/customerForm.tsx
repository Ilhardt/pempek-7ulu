// app/components/cart/CustomerForm.tsx
"use client";

import React from "react";

interface CustomerFormProps {
  customerName: string;
  customerPhone: string;
  onNameChange: (name: string) => void;
  onPhoneChange: (phone: string) => void;
}

export default function CustomerForm({
  customerName,
  customerPhone,
  onNameChange,
  onPhoneChange,
}: CustomerFormProps) {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Name Input */}
      <div>
        <label className="block text-gray-900 font-semibold mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">
          Nama <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Masukkan Nama Anda"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 text-sm sm:text-base lg:text-lg text-gray-700"
        />
      </div>

      {/* Phone Input */}
      <div>
        <label className="block text-gray-900 font-semibold mb-2 sm:mb-3 text-sm sm:text-base lg:text-lg">
          Nomor Telepon <span className="text-red-600">*</span>
        </label>
        <input
          type="tel"
          value={customerPhone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Contoh: 08123456789"
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-500 text-sm sm:text-base lg:text-lg text-gray-700"
        />
        <p className="text-xs sm:text-sm text-gray-600 mt-2">
          💡 Nomor ini digunakan untuk tracking pesanan Anda
        </p>
      </div>
    </div>
  );
}
// app/components/cart/CartSummary.tsx
"use client";

import React from "react";

interface CartSummaryProps {
  total: number;
  formatPrice: (price: number) => string;
  onSubmit: () => void;
  submitting: boolean;
}

export default function CartSummary({
  total,
  formatPrice,
  onSubmit,
  submitting,
}: CartSummaryProps) {
  return (
    <>
      {/* Total Price */}
      <div className="flex justify-between items-center py-4 sm:py-6 border-t-2 border-gray-300">
        <span className="text-xl sm:text-2xl font-bold text-gray-900">
          TOTAL
        </span>
        <span className="text-2xl sm:text-3xl font-bold text-red-600">
          {formatPrice(total)}
        </span>
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={submitting}
        className="w-full bg-red-600 text-white font-bold text-base sm:text-lg lg:text-xl py-4 sm:py-5 rounded-full hover:bg-red-700 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {submitting ? "Memproses..." : "Bayar"}
      </button>
    </>
  );
}
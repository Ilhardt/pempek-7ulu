"use client";

import React from "react";

interface OrderSummaryProps {
  itemName: string;
  totalPrice: number;
  formatPrice: (price: number) => string;
}

export default function OrderSummary({
  itemName,
  totalPrice,
  formatPrice,
}: OrderSummaryProps) {
  return (
    <div className="border-b-2 border-gray-200 pb-6 mb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          {itemName}
        </h2>
        <span className="text-2xl font-bold text-red-600">
          {formatPrice(totalPrice)}
        </span>
      </div>
    </div>
  );
}
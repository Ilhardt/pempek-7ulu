// app/components/customer/order/OrderHeader.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function OrderHeader() {
  const router = useRouter();

  return (
    <>
      {/* Title */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-serif font-bold text-gray-900 mb-6">
          Silahkan Order
        </h1>
        <p className="text-lg text-gray-700">
          Lagi ngidam pempek? Chat aja kami!
        </p>
      </div>
    </>
  );
}
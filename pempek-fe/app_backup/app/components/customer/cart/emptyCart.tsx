// app/components/cart/EmptyCart.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function EmptyCart() {
  const router = useRouter();

  return (
    <div className="text-center py-12">
      <p className="text-gray-600 text-lg sm:text-xl mb-6">
        Keranjang Anda masih kosong
      </p>
      <button
        onClick={() => router.push("/order")}
        className="bg-orange-500 text-white px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-orange-600 transition-all"
      >
        Mulai Belanja
      </button>
    </div>
  );
}
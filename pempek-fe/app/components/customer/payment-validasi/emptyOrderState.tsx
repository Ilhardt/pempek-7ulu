// components/customer/payment-validasi/EmptyOrderState.tsx
"use client";

import React from "react";
import { Clock, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmptyOrderState() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
      <div className="flex flex-col items-center text-center">
        <div className="mb-6">
          <Clock className="w-24 h-24 text-red-500" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          ⚠️ Data Pesanan Tidak Ditemukan
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Sepertinya Anda belum melakukan pemesanan atau data pesanan hilang.
        </p>

        <div className="space-y-4 w-full">
          <button
            onClick={() => router.push("/order")}
            className="w-full bg-red-600 text-white font-bold text-lg py-5 rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            🛍️ Buat Pesanan Baru
          </button>

          <button
            onClick={() => router.push("/")}
            className="w-full bg-gray-600 text-white font-bold text-lg py-5 rounded-full hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <Home className="w-6 h-6" />
            Kembali ke Beranda
          </button>
        </div>

        <div className="mt-8 p-6 bg-amber-50 rounded-2xl border-2 border-amber-200">
          <p className="text-amber-800 text-sm">
            💡 <strong>Tip:</strong> Pastikan Anda sudah membuat pesanan
            terlebih dahulu sebelum mengakses halaman ini.
          </p>
        </div>
      </div>
    </div>
  );
}

// app/components/OrderCard.tsx
"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface OrderCardProps {
  id: number;
  name: string;
  price: number;
  stock?: number;
  description?: string;
  image?: string;
  is_active?: number;
  onAddToCart: () => void;
}

export default function OrderCard({
  name,
  price,
  stock,
  description,
  image,
  is_active = 1,
  onAddToCart,
}: OrderCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp");
  };

  // Cek apakah produk bisa dipesan
  const isOutOfStock = stock !== undefined && stock === 0;
  const isUnavailable = is_active === 0 || isOutOfStock;

  // Dapatkan status badge
  const getStockBadge = () => {
    if (is_active === 0) {
      return { text: "TIDAK TERSEDIA", color: "bg-red-600", show: true };
    }
    if (isOutOfStock) {
      return { text: "HABIS", color: "bg-gray-600", show: true };
    }
    if (stock !== undefined && stock > 0 && stock <= 5) {
      return { text: `SISA ${stock}`, color: "bg-yellow-500", show: true };
    }
    return { text: "", color: "", show: false };
  };

  const stockBadge = getStockBadge();

  // Jika produk tidak tersedia atau stok habis
  if (isOutOfStock) {
    return (
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border relative opacity-75">
        {/* Banner Diagonal SOLD OUT */}
        <div className="absolute top-0 right-0 z-20 overflow-hidden w-32 h-32">
          <div className="absolute transform rotate-45 bg-gradient-to-r from-gray-700 to-gray-900 text-white text-center font-bold py-2 right-[-35px] top-[25px] w-[170px] shadow-lg">
            <span className="text-sm">SOLD OUT</span>
          </div>
        </div>

        {/* Gambar Produk - Sedikit Pudar */}
        <div className="h-56 bg-gradient-to-br from-orange-200 to-yellow-100 relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover opacity-60"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/400x300/fed7aa/f97316?text=${encodeURIComponent(
                  name
                )}`;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-orange-400 font-bold text-2xl opacity-60">
              {name}
            </div>
          )}
        </div>

        {/* Info Produk */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-gray-500 font-bold text-2xl">
              {formatPrice(price)}
            </p>
            <h3 className="text-xl font-bold text-gray-700 mt-2">{name}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-2d">
                {description}
              </p>
            )}
            <div className="mt-3 flex items-center justify-center gap-2 text-gray-600">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <p className="text-sm font-semibold">Stok Habis</p>
            </div>
          </div>
          <button
            disabled
            className="w-full bg-gray-300 text-gray-600 font-semibold py-3 rounded-full cursor-not-allowed"
          >
            Tidak Dapat Dipesan
          </button>
        </div>
      </div>
    );
  }

  // Produk aktif dan tersedia
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border hover:shadow-2xl transition-all transform hover:-translate-y-1">
      {/* Gambar Produk */}
      <div className="h-56 bg-gradient-to-br from-orange-200 to-yellow-100 relative">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://via.placeholder.com/400x300/fed7aa/f97316?text=${encodeURIComponent(
                name
              )}`;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-orange-600 font-bold text-2xl">
            {name}
          </div>
        )}

        {/* Badge Stok */}
        {stockBadge.show && (
          <div
            className={`absolute top-3 right-3 ${stockBadge.color} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}
          >
            {stockBadge.text}
          </div>
        )}
      </div>

      {/* Info Produk */}
      <div className="p-6 space-y-4">
        <div className="text-center">
          <p className="text-red-600 font-bold text-2xl">
            {formatPrice(price)}
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-2">{name}</h3>
          {description && (
            <p className="text-sm text-gray-600 mt-2">{description}</p>
          )}

          {/* Info Stok */}
          {stock !== undefined && stock > 5 && (
            <p className="text-xs text-green-600 font-semibold mt-2">
              ✓ Stok Tersedia ({stock})
            </p>
          )}
        </div>

        <button
          onClick={onAddToCart}
          className="w-full bg-red-600 text-white font-semibold py-3 rounded-full hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
        >
          Add
        </button>
      </div>
    </div>
  );
}

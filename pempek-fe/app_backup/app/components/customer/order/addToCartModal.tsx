"use client";

import React from "react";
import { X, Plus, Minus } from "lucide-react";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  is_active: number;
}

interface AddToCartModalProps {
  show: boolean;
  selectedItem: MenuItem | null;
  quantity: number;
  notes: string;
  onClose: () => void;
  onQuantityChange: (newQuantity: number) => void;
  onNotesChange: (notes: string) => void;
  onAddToCart: () => void;
  formatPrice: (price: number) => string;
}

export default function AddToCartModal({
  show,
  selectedItem,
  quantity,
  notes,
  onClose,
  onQuantityChange,
  onNotesChange,
  onAddToCart,
  formatPrice,
}: AddToCartModalProps) {
  if (!show || !selectedItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 z-10"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-6 text-center text-gray-900 pr-8">
          Tambah Pesanan Anda
        </h2>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Frame produk */}
          <div className="border-2 border-gray-200 rounded-2xl p-4 flex-shrink-0 md:w-64 w-full">
            <img
              src={
                selectedItem.image ||
                `https://via.placeholder.com/400x300/fed7aa/f97316?text=${encodeURIComponent(
                  selectedItem.name
                )}`
              }
              alt={selectedItem.name}
              className="w-full h-40 rounded-xl object-cover mb-3"
              onError={(e) => {
                e.currentTarget.src = `https://via.placeholder.com/400x300/fed7aa/f97316?text=${encodeURIComponent(
                  selectedItem.name
                )}`;
              }}
            />
            <p className="text-red-600 font-bold text-lg text-center mb-2">
              {formatPrice(selectedItem.price)}/pcs
            </p>
            <h3 className="text-base font-bold text-gray-900 text-center">
              {selectedItem.name}
            </h3>
            {selectedItem.description && (
              <p className="text-sm text-gray-600 text-center mt-2">
                {selectedItem.description}
              </p>
            )}
          </div>

          {/* Kolom Kanan */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Input Catatan */}
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-900 text-sm">
                Catatan (Opsional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Contoh: Goreng Garing Ya"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Total dan Quantity */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Harga</p>
                <span className="font-bold text-2xl text-red-600">
                  {formatPrice(selectedItem.price * quantity)}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:bg-red-50 text-gray-700 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-xl font-bold w-8 text-center text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => onQuantityChange(quantity + 1)}
                  className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-red-600 hover:bg-red-50 text-gray-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tombol */}
            <button
              onClick={onAddToCart}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-full hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Tambah ke Keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

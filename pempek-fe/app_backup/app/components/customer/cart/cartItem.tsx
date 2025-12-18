// app/components/cart/CartItem.tsx
"use client";

import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

type CartItemType = {
  menu_item_id: number;
  name: string;
  price: number;
  quantity: number;
  notes: string;
  image: string;
};

interface CartItemProps {
  item: CartItemType;
  index: number;
  onUpdateQuantity: (index: number, newQuantity: number) => void;
  onRemoveItem: (index: number) => void;
  onUpdateNotes: (index: number, notes: string) => void;
  formatPrice: (price: number) => string;
}

export default function CartItem({
  item,
  index,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateNotes,
  formatPrice,
}: CartItemProps) {
  return (
    <div className="border-2 border-gray-200 rounded-2xl p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        {/* Product Image */}
        <div className="w-full sm:w-28 lg:w-32 h-28 sm:h-28 lg:h-32 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-200 to-yellow-100">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://via.placeholder.com/200x200/FED7AA/000000?text=" +
                item.name;
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 w-full min-w-0">
          {/* Header: Name & Delete Button */}
          <div className="flex justify-between items-start mb-2 sm:mb-3 gap-2">
            <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-900 truncate pr-2">
              {item.name}
            </h3>
            <button
              onClick={() => onRemoveItem(index)}
              className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
              aria-label="Hapus item"
            >
              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Notes Input */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Catatan
            </label>
            <input
              type="text"
              value={item.notes}
              onChange={(e) => onUpdateNotes(index, e.target.value)}
              placeholder="cth: Goreng Garing Ya Mas"
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-gray-700"
            />
          </div>

          {/* Price & Quantity Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2">
            {/* Price */}
            <span className="text-red-600 font-bold text-base sm:text-lg lg:text-xl">
              {formatPrice(item.price * item.quantity)}
            </span>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-red-600 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                aria-label="Kurangi jumlah"
              >
                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              <span className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 w-6 sm:w-8 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-red-600 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all"
                aria-label="Tambah jumlah"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
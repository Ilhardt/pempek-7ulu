"use client";

import React from "react";

interface MenuCardProps {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  formatPrice: (price: number) => string;
}

export default function MenuCard({
  name,
  price,
  description,
  image,
  formatPrice,
}: MenuCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all hover:scale-105 hover:shadow-2xl cursor-pointer">
      {/* Image */}
      <div className="relative h-64 bg-gradient-to-br from-orange-200 to-yellow-100 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/400x300/FED7AA/000000?text=' + name;
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-center space-y-3">
          <p className="text-red-600 font-bold text-2xl">
            {formatPrice(price)}
          </p>
          <h3 className="text-2xl font-bold text-gray-900">
            {name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
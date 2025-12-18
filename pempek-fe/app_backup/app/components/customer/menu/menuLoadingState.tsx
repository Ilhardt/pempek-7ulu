"use client";

import React from "react";

export default function MenuLoadingState() {
  return (
    <div className="text-center py-20">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
      <p className="mt-4 text-gray-600">Memuat menu...</p>
    </div>
  );
}
"use client";

import React from "react";

interface MenuErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function MenuErrorState({ error, onRetry }: MenuErrorStateProps) {
  return (
    <div className="text-center py-20">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
        <p className="font-semibold">{error}</p>
        <button 
          onClick={onRetry}
          className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
"use client";

import React from "react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-20">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
        <p className="font-semibold mb-2">❌ {error}</p>
        <p className="text-sm mb-4">
          Pastikan backend server berjalan di port 5000
        </p>
        <button
          onClick={onRetry}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}

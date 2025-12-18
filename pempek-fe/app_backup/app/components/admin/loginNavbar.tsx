// app/components/admin/LoginNavbar.tsx
"use client";

import React from 'react';
import Link from 'next/link';

export default function LoginNavbar() {
  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/login" className="flex-shrink-0">
            <div className="bg-orange-500 text-white font-bold text-xl px-3 py-2 rounded-lg transform -rotate-3 cursor-pointer hover:scale-105 transition-transform">
              PEMPEK
              <div className="text-3xl">7ULU</div>
            </div>
          </Link>

          <div>
            <button className="px-8 py-3 bg-orange-200 hover:bg-orange-300 text-gray-800 font-medium rounded-full transition-colors">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
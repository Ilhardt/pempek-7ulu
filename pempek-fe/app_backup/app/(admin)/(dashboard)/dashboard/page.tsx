// app/(admin)/(dashboard)/dashboard/page.tsx
"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="min-h-full p-4 sm:p-6 lg:p-12">
      {/* Mobile: Stack Cards */}
      <div className="flex flex-col gap-6 lg:hidden">
        <button
          onClick={() => router.push('/orders')}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-4"
        >
          <svg className="w-16 h-16 flex-shrink-0" fill="#404040" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-lg font-bold text-gray-900">DAFTAR PESANAN</h3>
        </button>

        <button
          onClick={() => router.push('/payment-confirmation')}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-4"
        >
          <svg className="w-16 h-16 flex-shrink-0" fill="#404040" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
          </svg>
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-bold text-gray-900 leading-tight">KONFIRMASI</h3>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">PEMBAYARAN</h3>
          </div>
        </button>

        <button
          onClick={() => router.push('/products')}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-4"
        >
          <svg className="w-16 h-16 flex-shrink-0" fill="#404040" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-lg font-bold text-gray-900">PRODUK</h3>
        </button>

        <button
          onClick={() => router.push('/info')}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-4"
        >
          <svg className="w-16 h-16 flex-shrink-0" fill="#404040" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <h3 className="text-lg font-bold text-gray-900">INFORMASI USAHA</h3>
        </button>
      </div>

      {/* Desktop: Layout Diagonal */}
      <div className="hidden lg:block relative" style={{ minHeight: '80vh' }}>
        {/* Card 1: DAFTAR PESANAN - Top Left */}
        <div 
          className="absolute w-80 xl:w-96"
          style={{ top: '60px', left: '40px' }}
        >
          <button
            onClick={() => router.push('/orders')}
            className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-5"
          >
            <svg className="w-16 h-16 flex-shrink-0" fill="#404040" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"></path>
            </svg>
            <h3 className="text-xl font-bold text-gray-900">DAFTAR PESANAN</h3>
          </button>
        </div>

        {/* Card 2: KONFIRMASI PEMBAYARAN - Below Daftar Pesanan */}
        <div 
          className="absolute w-80 xl:w-96"
          style={{ top: '180px', left: '350px' }}
        >
          <button
            onClick={() => router.push('/payment-confirmation')}
            className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-5"
          >
            <svg className="w-16 h-16 flex-shrink-0" fill="#404040" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
            </svg>
            <div className="flex flex-col items-start">
              <h3 className="text-xl font-bold text-gray-900 leading-tight">KONFIRMASI</h3>
              <h3 className="text-xl font-bold text-gray-900 leading-tight">PEMBAYARAN</h3>
            </div>
          </button>
        </div>

        {/* Card 3: PRODUK - Center (Diagonal) */}
        <div 
          className="absolute w-80 xl:w-96"
          style={{ top: '300px', left: '50%', transform: 'translateX(-30%)' }}
        >
          <button
            onClick={() => router.push('/products')}
            className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-5"
          >
            <svg className="w-16 h-16 flex-shrink-0" fill="#404040" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd"></path>
            </svg>
            <h3 className="text-xl font-bold text-gray-900">PRODUK</h3>
          </button>
        </div>

        {/* Card 4: INFORMASI USAHA - Bottom Right */}
        <div 
          className="absolute w-96 xl:w-[420px]"
          style={{ top: '420px', right: '150px' }}
        >
          <button
            onClick={() => router.push('/info')}
            className="w-full bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 flex items-center gap-5"
          >
            <svg className="w-16 h-16 flex-shrink-0" fill="#404040" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            <h3 className="text-xl font-bold text-gray-900">INFORMASI USAHA</h3>
          </button>
        </div>
      </div>
    </div>
  );
}
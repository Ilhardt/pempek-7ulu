// app/page.tsx
'use client';

import React from 'react';
import Navbar from '../components/customer/navbar';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20">
        <div className="relative min-h-screen overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url(https://i.imgur.com/KCSxSZ7.jpeg)',
              backgroundColor: '#f5f5f5'
            }}
          >
            {/* Overlay untuk memastikan text tetap terbaca */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-white/70"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen">
            <div className="grid md:grid-cols-2 gap-8 items-center h-full">
              
              {/* Left side - Space for Background Image */}
              <div className="relative order-2 md:order-1">
                {/* Ilustrasi toko akan muncul dari background image */}
              </div>

              {/* Right side - Content */}
              <div className="relative order-1 md:order-2 text-center md:text-right space-y-8 py-12">
                <div>
                  <h1 className="text-6xl sm:text-7xl lg:text-8xl font-serif font-bold text-gray-900 leading-tight">
                    Selamat
                    <br />
                    Datang
                  </h1>
                </div>

                <p className="text-lg sm:text-xl text-gray-700 leading-relaxed max-w-xl ml-auto">
                  Di Pempek 7 Ulu, tempat kami menyajikan pempek Palembang asli dengan rasa yang lezat dan autentik. Nikmati pengalaman makan pempek yang khas dan menggugah selera!
                </p>

                <div className="flex justify-center md:justify-end">
                  <Link 
                    href="/order"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-10 py-4 rounded-full shadow-lg transform transition-all hover:scale-105 hover:shadow-xl"
                  >
                    Pesan Sekarang
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
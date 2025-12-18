// app/components/navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Menu, X, Package } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const pathname = usePathname();

  // Update cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('pempek_cart');
      if (savedCart) {
        const cart = JSON.parse(savedCart);
        const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="bg-orange-500 text-white font-bold text-xl px-3 py-2 rounded-lg transform -rotate-3 cursor-pointer hover:scale-105 transition-transform">
              PEMPEK
              <div className="text-3xl">7ULU</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Link
              href="/"
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                pathname === '/'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-orange-100'
              }`}
            >
              Home
            </Link>
            <Link
              href="/menu"
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                pathname === '/menu'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-orange-100'
              }`}
            >
              Menu
            </Link>
            <Link
              href="/kontak"
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                pathname === '/kontak'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-orange-100'
              }`}
            >
              Kontak
            </Link>
            <Link
              href="/order"
              className={`px-8 py-3 rounded-full font-medium transition-all ${
                pathname === '/order'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-orange-100'
              }`}
            >
              Order
            </Link>
            
            {/* Pesanan Saya - dengan icon Package */}
            <Link
              href="/my-orders"
              className={`px-8 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                pathname === '/order-detail'
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-orange-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Pesanan Saya
            </Link>
          </div>

          {/* Cart Icon */}
          <div className="hidden md:block">
            <Link 
              href="/cart"
              className="relative p-3 hover:bg-orange-100 rounded-full transition-colors cursor-pointer block"
            >
              <ShoppingCart className="w-8 h-8 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link 
              href="/cart"
              className="relative p-2 hover:bg-orange-100 rounded-full"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium text-left ${
                  pathname === '/'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-orange-100'
                }`}
              >
                Home
              </Link>
              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium text-left ${
                  pathname === '/menu'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-orange-100'
                }`}
              >
                Menu
              </Link>
              <Link
                href="/kontak"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium text-left ${
                  pathname === '/kontak'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-orange-100'
                }`}
              >
                Kontak
              </Link>
              <Link
                href="/order"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium text-left ${
                  pathname === '/order'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-orange-100'
                }`}
              >
                Order
              </Link>
              
              {/* Pesanan Saya - Mobile - dengan icon */}
              <Link
                href="/my-orders"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium text-left flex items-center gap-2 ${
                  pathname === '/order-detail'
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-orange-100'
                }`}
              >
                <Package className="w-4 h-4" />
                Pesanan Saya
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
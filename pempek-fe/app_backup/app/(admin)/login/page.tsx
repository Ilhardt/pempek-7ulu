// app/(admin)/login/page.tsx - OPTIMIZED
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // ✅ Import Next.js Image
import LoginNavbar from '../../components/admin/loginNavbar';
import { authAPI } from '../../lib/api';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const data = await authAPI.login(username, password);
      
      console.log('Login response:', data);

      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminName', data.user?.username || 'Admin');
        
        document.cookie = `admin_token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;
        
        alert('Login berhasil!');
        router.push('/dashboard');
      } else {
        setError('Login gagal. Token tidak ditemukan.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Username atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <LoginNavbar />

      {/* ✅ PERBAIKAN: Gunakan Next.js Image dengan proper optimization */}
      <div className="fixed inset-0 pt-20 -z-10">
        <Image 
          src="https://i.imgur.com/KCSxSZ7.jpeg"
          alt="Pempek 7 ULU Background"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={75}
        />
      </div>

      <div className="flex items-center justify-center lg:justify-end min-h-screen pt-20 px-4 sm:px-6 lg:pr-20">
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 w-full max-w-md">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-light text-gray-900 mb-8 lg:mb-10 text-center">
            Login
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 lg:space-y-6">
            <div>
              <label className="block text-gray-900 font-semibold mb-2 text-sm">
                Username :
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 sm:px-5 py-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all text-gray-800 placeholder-gray-500"
                disabled={loading}
                required
              />
            </div>

            <div>
              <label className="block text-gray-900 font-semibold mb-2 text-sm">
                Password :
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 sm:px-5 py-3 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all text-gray-800 placeholder-gray-500"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-full mt-6 lg:mt-8 transition-colors shadow-lg disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
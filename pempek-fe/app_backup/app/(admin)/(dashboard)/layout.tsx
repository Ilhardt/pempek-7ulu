// app/(admin)/(dashboard)/layout.tsx
"use client";

import React, { useState } from "react";
import Sidebar from "./../../components/admin/sidebar";
import { Menu } from "lucide-react";

export default function DashboardLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#FAC388' }}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        {/* Header - Background Putih */}
        <div className="bg-white px-4 sm:px-8 py-4 flex justify-between items-center shadow-sm">
          {/* Hamburger Button - Mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-900" />
          </button>

          {/* Nama Admin - Warna #FAC388 */}
          <div 
            className="font-bold text-base tracking-wide ml-auto px-4 py-2 rounded-lg"
            style={{ backgroundColor: '#FAC388' }}
          >
            NAMA ADMIN
          </div>
        </div>

        {/* Page Content - Background #FAC388 */}
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: '#FAC388' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
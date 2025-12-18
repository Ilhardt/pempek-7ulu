// app/components/admin/Sidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X } from "lucide-react";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState("ADMIN");

  useEffect(() => {
    fetchAdminName();
  }, []);

  const fetchAdminName = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.log("No token found");
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/admin/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Admin profile:", result);

        if (result.success && result.data && result.data.username) {
          setAdminName(result.data.username.toUpperCase());
        }
      } else {
        const errorData = await response.json();
        console.error(
          "❌ Failed to fetch profile:",
          response.status,
          errorData
        );
        // Tetap gunakan default "ADMIN"
      }
    } catch (error) {
      console.error("❌ Error fetching admin name:", error);
      // Tetap gunakan default "ADMIN" - tidak masalah
    }
  };

  const menuItems = [
    {
      name: "DASHBOARD",
      path: "/dashboard",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
        </svg>
      ),
    },
    {
      name: "DAFTAR PESANAN",
      path: "/orders",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"></path>
          <path
            fillRule="evenodd"
            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      name: "KONF. PEMBAYARAN",
      path: "/payment-confirmation",
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      name: "PRODUK",
      path: "/products", 
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
    {
      name: "INFORMASI USAHA",
      path: "/business-info", 
      icon: (
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    if (confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminName");
      document.cookie =
        "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    }
  };

  const handleMenuClick = (path: string) => {
    router.push(path);
    if (onClose) onClose();
  };

  return (
    <aside
      className="w-72 text-white flex flex-col h-full"
      style={{ backgroundColor: "#7F7B7B" }}
    >
      {/* Header Sidebar - Full Width White Background */}
      <div className="bg-white px-6 py-2">
        <div className="flex items-center justify-between">
          {/* Profile Section */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center border-2 border-gray-300">
              <img
                src="https://i.imgur.com/ncfo8TY.png"
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-gray-900 font-bold text-xl">{adminName}</h2>
            </div>
          </div>

          {/* Close Button for Mobile */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-900" />
            </button>
          )}
        </div>
      </div>

      {/* Status Online - Horizontal di bawah header */}
      <div
        className="px-6 py-3 border-t border-gray-200 flex items-center gap-3"
        style={{ backgroundColor: "#7F7B7B" }}
      >
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <span className="font-bold text-sm tracking-wide text-white">
          ONLINE
        </span>
      </div>

      {/* Menu Items - Stack Vertically */}
      <nav className="flex-1 py-2 flex flex-col gap-2">
        {menuItems.map((item) => (
          <div key={item.path} className="px-3">
            <button
              onClick={() => handleMenuClick(item.path)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
                pathname === item.path
                  ? "text-white"
                  : "text-gray-900 hover:bg-gray-400"
              }`}
              style={{
                backgroundColor: pathname === item.path ? "#5A5757" : "#C3C1C1",
              }}
            >
              {item.icon}
              <span className="font-bold text-sm">{item.name}</span>
            </button>
          </div>
        ))}

        {/* Logout Button */}
        <div className="px-3 mt-auto mb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-gray-900 hover:bg-gray-400 transition-all"
            style={{ backgroundColor: "#C3C1C1" }}
          >
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="font-bold text-sm">LOGOUT</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}

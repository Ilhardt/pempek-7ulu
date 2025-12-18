"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/customer/navbar";
import MenuHeader from "../../components/customer/menu/menuHeader";
import MenuLoadingState from "../../components/customer/menu/menuLoadingState";
import MenuErrorState from "../../components/customer/menu/menuErrorState";
import MenuEmptyState from "../../components/customer/menu/menuEmptyState";
import MenuCard from "../../components/customer/menu/menuCard";
import MenuBackground from "../../components/customer/menu/menuBackground";
import { menuAPI } from "../../lib/api";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await menuAPI.getAll();
      console.log("Menu data:", data);
      
      setMenuItems(Array.isArray(data) ? data : []);
      
    } catch (err: any) {
      console.error("Error fetching menu:", err);
      setError(err.message || "Gagal memuat menu. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 min-h-screen relative">
        {/* Background Image */}
        <MenuBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Header */}
          <MenuHeader />

          {/* Loading State */}
          {loading && <MenuLoadingState />}

          {/* Error State */}
          {error && <MenuErrorState error={error} onRetry={fetchMenu} />}

          {/* Menu Grid */}
          {!loading && !error && menuItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {menuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  image={item.image}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && menuItems.length === 0 && <MenuEmptyState />}
        </div>
      </div>
    </div>
  );
}
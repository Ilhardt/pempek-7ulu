// app/(customer)/order/page.tsx - REFACTORED VERSION
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/customer/navbar";
import OrderCard from "../../components/customer/order/orderCard";
import OrderHeader from "../../components/customer/order/orderHeader";
import LoadingState from "../../components/customer/order/loadingState";
import ErrorState from "../../components/customer/order/errorState";
import EmptyState from "../../components/customer/order/emptyState";
import ContactInfo from "../../components/customer/order/contactInfo";
import AddToCartModal from "../../components/customer/order/addToCartModal";

type MenuItem = {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  image: string;
  is_active: number;
};

type CartItem = {
  menu_item_id: number;
  name: string;
  price: number;
  quantity: number;
  notes: string;
  image: string;
};

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMenu();
    loadCartFromStorage();
  }, []);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:5000/api/menu");

      if (!response.ok) {
        throw new Error("Gagal memuat menu");
      }

      const result = await response.json();
      const data = result.data || result;

      setMenuItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching menu:", err);
      setError(err.message || "Gagal memuat menu");
    } finally {
      setLoading(false);
    }
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("pempek_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  };

  const saveCartToStorage = (cartData: CartItem[]) => {
    localStorage.setItem("pempek_cart", JSON.stringify(cartData));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const openModal = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setNotes("");
    setShowModal(true);
  };

  const addToCart = () => {
    if (selectedItem) {
      const newCartItem: CartItem = {
        menu_item_id: selectedItem.id,
        name: selectedItem.name,
        price: selectedItem.price,
        quantity: quantity,
        notes: notes,
        image: selectedItem.image,
      };
      const updatedCart = [...cart, newCartItem];
      setCart(updatedCart);
      saveCartToStorage(updatedCart);
      setShowModal(false);
      alert("✅ Item ditambahkan ke keranjang!");
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
      <div className="pt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <OrderHeader />

          {loading && <LoadingState />}

          {error && <ErrorState error={error} onRetry={fetchMenu} />}

          {!loading && !error && menuItems.length === 0 && <EmptyState />}

          {!loading && !error && menuItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {menuItems.map((item) => (
                <OrderCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  stock={item.stock}
                  description={item.description}
                  image={item.image}
                  is_active={item.is_active}
                  onAddToCart={() => openModal(item)}
                />
              ))}
            </div>
          )}

          <ContactInfo />
        </div>
      </div>

      <AddToCartModal
        show={showModal}
        selectedItem={selectedItem}
        quantity={quantity}
        notes={notes}
        onClose={() => setShowModal(false)}
        onQuantityChange={setQuantity}
        onNotesChange={setNotes}
        onAddToCart={addToCart}
        formatPrice={formatPrice}
      />
    </div>
  );
}
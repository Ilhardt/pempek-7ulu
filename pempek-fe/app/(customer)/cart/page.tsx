// app/cart/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../../components/customer/navbar";
import { orderAPI } from "../../lib/api";
import { useRouter } from "next/navigation";

// Import components
import CartItem from "../../components/customer/cart/cartItem";
import CustomerForm from "../../components/customer/cart/customerForm";
import EmptyCart from "../../components/customer/cart/emptyCart";
import CartSummary from "../../components/customer/cart/cartSummary";

type CartItem = {
  menu_item_id: number;
  name: string;
  price: number;
  quantity: number;
  notes: string;
  image: string;
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCartFromStorage();

    // Auto-fill phone jika sudah ada
    const savedPhone = localStorage.getItem("customer_phone");
    if (savedPhone) {
      setCustomerPhone(savedPhone);
    }
  }, []);

  // ==================== CART MANAGEMENT ====================
  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem("pempek_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCartToStorage = (cartData: CartItem[]) => {
    localStorage.setItem("pempek_cart", JSON.stringify(cartData));
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cart];
    updatedCart[index].quantity = newQuantity;
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const removeItem = (index: number) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const updateNotes = (index: number, notes: string) => {
    const updatedCart = [...cart];
    updatedCart[index].notes = notes;
    setCart(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
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

  // ==================== ORDER SUBMISSION ====================
  const handleSubmit = async () => {
    // Validasi cart
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }

    // Validasi nama
    if (!customerName.trim()) {
      alert("Mohon masukkan nama Anda!");
      return;
    }

    // Validasi phone
    if (!customerPhone.trim()) {
      alert("Mohon masukkan nomor telepon Anda!\n\nNomor telepon diperlukan untuk tracking pesanan.");
      return;
    }

    const phoneDigits = customerPhone.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      alert("Nomor telepon tidak valid! Minimal 10 digit.");
      return;
    }

    try {
      setSubmitting(true);

      // Kumpulkan semua catatan dari items
      const allItemNotes = cart
        .map((item) => item.notes)
        .filter((note) => note && note.trim())
        .join(" | ");

      const orderData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: "Pickup di tempat",
        items: cart.map((item) => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.price,
          notes: item.notes || null,
        })),
        total_price: getTotal(),
        notes: allItemNotes || "Pickup - Ambil di tempat",
      };

      console.log('📤 Creating order...', orderData);
      const response = await orderAPI.create(orderData);
      console.log('✅ Order created:', response);

      const serverOrderId = response.order_id || response.data?.order_id || response.id;

      if (!serverOrderId) {
        throw new Error("Order ID tidak ditemukan dalam response");
      }

      console.log('🆔 Order ID:', serverOrderId);

      // ⭐⭐⭐ BACKUP CART SEBELUM CLEAR ⭐⭐⭐
      // Ini untuk restore jika user cancel di payment page
      const currentCart = localStorage.getItem("pempek_cart");
      if (currentCart) {
        localStorage.setItem("pempek_cart_backup", currentCart);
        console.log('✅ Cart backed up for potential restore');
      }

      // Simpan ke sessionStorage
      const itemNames = cart.map((i) => `${i.name} (${i.quantity}x)`).join(", ");
      
      sessionStorage.setItem("payment_order_id", serverOrderId.toString());
      sessionStorage.setItem("payment_item_name", itemNames);
      sessionStorage.setItem("payment_total", getTotal().toString());
      sessionStorage.setItem("payment_customer_name", customerName);
      
      console.log('💾 Data saved to sessionStorage');

      // Simpan phone ke localStorage untuk auto-fill next time
      localStorage.setItem("customer_phone", customerPhone);

      // Simpan order detail untuk history
      const orderDetail = {
        customerName: customerName,
        orderId: serverOrderId,
        orderDate: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        products: cart.map((item) => `${item.name} (${item.quantity})`),
        notes: allItemNotes || "-",
        status: "Diproses",
        totalPrice: getTotal(),
      };
      localStorage.setItem("last_order", JSON.stringify(orderDetail));

      // ⭐ Clear cart SETELAH backup
      setCart([]);
      localStorage.removeItem("pempek_cart");
      window.dispatchEvent(new Event("cartUpdated")); // Trigger navbar update

      console.log('🚀 Redirecting to payment page...');

      // Redirect ke payment dengan query params sebagai backup
      router.push(
        `/payment?orderId=${serverOrderId}&item=${encodeURIComponent(itemNames)}&total=${getTotal()}&customer=${encodeURIComponent(customerName)}`
      );

    } catch (error: any) {
      console.error("❌ Error creating order:", error);
      alert(`Gagal membuat pesanan: ${error.message}\n\nSilakan coba lagi atau hubungi admin.`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />

      <div className="pt-20 min-h-screen py-8 sm:py-16 mt-4 sm:mt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-8 sm:mb-12 mt-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-900 mb-2 sm:mb-4">
              Keranjang Saya
            </h1>
          </div>

          {/* Main Content Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-4 sm:p-8 lg:p-12">
            {cart.length === 0 ? (
              <EmptyCart />
            ) : (
              <div className="space-y-6 sm:space-y-8">
                {/* Customer Form */}
                <CustomerForm
                  customerName={customerName}
                  customerPhone={customerPhone}
                  onNameChange={setCustomerName}
                  onPhoneChange={setCustomerPhone}
                />

                {/* Cart Items List */}
                <div className="space-y-4 sm:space-y-6">
                  {cart.map((item, index) => (
                    <CartItem
                      key={index}
                      item={item}
                      index={index}
                      onUpdateQuantity={updateQuantity}
                      onRemoveItem={removeItem}
                      onUpdateNotes={updateNotes}
                      formatPrice={formatPrice}
                    />
                  ))}
                </div>

                {/* Cart Summary & Submit */}
                <CartSummary
                  total={getTotal()}
                  formatPrice={formatPrice}
                  onSubmit={handleSubmit}
                  submitting={submitting}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
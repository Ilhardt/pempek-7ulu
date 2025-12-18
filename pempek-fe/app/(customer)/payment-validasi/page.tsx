// app/payment-validasi/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from "react";
import Navbar from "../../components/customer/navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { orderAPI } from "../../lib/api";
import StatusIndicator from "../../components/customer/payment-validasi/statusIndicator";
import StatusHeader from "../../components/customer/payment-validasi/statusHeader";
import OrderDetailsCard from "../../components/customer/payment-validasi/orderDetailsCard";
import StatusMessage from "../../components/customer/payment-validasi/statusMessage";
import WhatsAppInstructions from "../../components/customer/payment-validasi/whatsAppInstructions";
import ActionButtons from "../../components/customer/payment-validasi/actionButtons";
import EmptyOrderState from "../../components/customer/payment-validasi/emptyOrderState";

function PaymentValidasiContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    customerName: "Customer",
    itemName: "Pempek",
    totalPrice: 0,
    paymentMethod: "upload" as "upload" | "whatsapp",
  });

  const [status, setStatus] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  // Fungsi untuk mengecek status pembayaran dari server
  const checkPaymentStatus = async () => {
    const orderId = orderDetails.orderId;

    if (!orderId || orderId === "") {
      console.warn("No order ID available for checking");
      return;
    }

    try {
      setIsChecking(true);
      console.log("🔍 Checking payment status for order:", orderId);

      const orderData = await orderAPI.getById(orderId);

      console.log("📦 Full order data:", orderData);
      console.log("📊 Order status field:", orderData.status);

      if (orderData && orderData.status) {
        const serverStatus = orderData.status.toLowerCase();
        console.log("✅ Status from server:", serverStatus);

        // Mapping status dari server ke status lokal
        let newStatus: "pending" | "approved" | "rejected" = "pending";

        if (serverStatus === "confirmed" || serverStatus === "approved") {
          newStatus = "approved";
        } else if (
          serverStatus === "cancelled" ||
          serverStatus === "rejected"
        ) {
          newStatus = "rejected";
        } else if (serverStatus === "pending") {
          newStatus = "pending";
        }

        console.log("🔄 Mapped status:", newStatus);

        if (newStatus !== status) {
          console.log("🔄 Status changed from", status, "to", newStatus);
          setStatus(newStatus);

          // Tampilkan notifikasi jika status berubah
          if (newStatus === "approved") {
            alert(
              "🎉 Pembayaran Anda telah diverifikasi!\n\nPesanan sedang diproses."
            );
          } else if (newStatus === "rejected") {
            alert(
              "❌ Pembayaran ditolak.\n\nSilakan hubungi admin untuk informasi lebih lanjut."
            );
          }
        }
      }

      setLastChecked(new Date());
    } catch (error: any) {
      console.error("❌ Error checking payment status:", error.message);
    } finally {
      setIsChecking(false);
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

  const handleWhatsAppContact = () => {
    // Pesan yang berbeda berdasarkan metode dan status
    let message = "";

    if (orderDetails.paymentMethod === "whatsapp" && status === "pending") {
      // Customer mengalami masalah dengan QRIS dan butuh bantuan
      message = encodeURIComponent(
        `Halo Admin Pempek 7 Ulu! 🙏\n\n` +
          `Saya mengalami kendala dengan pembayaran QRIS dan membutuhkan bantuan.\n\n` +
          `📋 Detail Pesanan:\n` +
          `• Order ID: ${orderDetails.orderId}\n` +
          `• Nama: ${orderDetails.customerName}\n` +
          `• Pesanan: ${orderDetails.itemName}\n` +
          `• Total: ${formatPrice(orderDetails.totalPrice)}\n\n` +
          `❌ Masalah: QRIS tidak bisa dibuka / error saat scan\n\n` +
          `Apakah ada metode pembayaran alternatif (transfer bank)? Atau bagaimana solusinya kak?\n\n` +
          `Mohon bantuannya segera ya! Terima kasih 🙏`
      );
    } else if (
      orderDetails.paymentMethod === "upload" &&
      status === "pending"
    ) {
      // Customer sudah upload bukti, tanya status
      message = encodeURIComponent(
        `Halo Admin Pempek 7 Ulu! 👋\n\n` +
          `Saya ingin menanyakan status pembayaran saya:\n\n` +
          `📋 Order ID: ${orderDetails.orderId}\n` +
          `👤 Nama: ${orderDetails.customerName}\n` +
          `🛍️ Pesanan: ${orderDetails.itemName}\n` +
          `💰 Total: ${formatPrice(orderDetails.totalPrice)}\n\n` +
          `✅ Bukti pembayaran sudah diupload\n\n` +
          `Mohon dicek dan dikonfirmasi ya kak! 🙏`
      );
    } else {
      // Default message untuk status lain
      message = encodeURIComponent(
        `Halo Admin Pempek 7 Ulu! 👋\n\n` +
          `Saya ingin menanyakan pesanan saya:\n\n` +
          `📋 Order ID: ${orderDetails.orderId}\n` +
          `👤 Nama: ${orderDetails.customerName}\n` +
          `🛍️ Pesanan: ${orderDetails.itemName}\n` +
          `💰 Total: ${formatPrice(orderDetails.totalPrice)}\n\n` +
          `Mohon infonya ya kak! 🙏`
      );
    }

    const whatsappNumber = "628557694746";
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  // Load data awal
  useEffect(() => {
    // Ambil status dari URL parameter
    const urlStatus = searchParams.get("status") as
      | "pending"
      | "approved"
      | "rejected"
      | null;
    if (urlStatus) {
      setStatus(urlStatus);
    }

    // Ambil data order dari sessionStorage
    const orderId = sessionStorage.getItem("payment_order_id") || "";
    const customerName =
      sessionStorage.getItem("payment_customer_name") || "Customer";
    const itemName = sessionStorage.getItem("payment_item_name") || "Pempek";
    const totalPrice = parseFloat(
      sessionStorage.getItem("payment_total") || "0"
    );
    const paymentMethod = (sessionStorage.getItem("payment_method") ||
      "upload") as "upload" | "whatsapp";

    if (!orderId) {
      console.warn(
        "⚠️ No order ID found - user might need to go back to payment"
      );
      return;
    }

    setOrderDetails({
      orderId,
      customerName,
      itemName,
      totalPrice,
      paymentMethod,
    });
  }, [searchParams, router]);

  // Auto-refresh: Cek status setiap 10 detik jika masih pending
  useEffect(() => {
    if (!orderDetails.orderId) return;

    // Cek pertama kali saat halaman dimuat
    checkPaymentStatus();

    // Setup interval untuk auto-refresh hanya jika status masih pending
    let intervalId: NodeJS.Timeout | null = null;

    if (status === "pending") {
      console.log("⏱️ Starting auto-refresh (every 10 seconds)");
      intervalId = setInterval(() => {
        checkPaymentStatus();
      }, 10000);
    }

    return () => {
      if (intervalId) {
        console.log("🛑 Stopping auto-refresh");
        clearInterval(intervalId);
      }
    };
  }, [orderDetails.orderId, status]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />

      <div className="pt-20 min-h-screen py-16 mt-6">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Jika tidak ada Order ID - tampilkan error */}
          {!orderDetails.orderId ? (
            <EmptyOrderState />
          ) : (
            <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
              {/* Auto-refresh indicator - hanya untuk yang upload bukti */}
              {status === "pending" &&
                orderDetails.paymentMethod === "upload" && (
                  <StatusIndicator
                    isChecking={isChecking}
                    lastChecked={lastChecked}
                  />
                )}

              {/* Status Icon & Title */}
              <StatusHeader
                status={status}
                paymentMethod={orderDetails.paymentMethod}
              />

              {/* Order Details Card */}
              <OrderDetailsCard
                orderId={orderDetails.orderId}
                customerName={orderDetails.customerName}
                itemName={orderDetails.itemName}
                totalPrice={orderDetails.totalPrice}
                paymentMethod={orderDetails.paymentMethod}
                status={status}
              />

              {/* Status Message */}
              <StatusMessage
                status={status}
                paymentMethod={orderDetails.paymentMethod}
              />

              {/* Special Message for WhatsApp Confirmation */}
              {orderDetails.paymentMethod === "whatsapp" &&
                status === "pending" && <WhatsAppInstructions />}

              {/* Action Buttons */}
              <ActionButtons
                status={status}
                paymentMethod={orderDetails.paymentMethod}
                isChecking={isChecking}
                onRefresh={checkPaymentStatus}
                onWhatsAppContact={handleWhatsAppContact}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PaymentValidasiPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <PaymentValidasiContent />
    </Suspense>
  );
}

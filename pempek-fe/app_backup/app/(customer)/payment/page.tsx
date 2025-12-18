"use client";

import React, { useEffect, useState, Suspense } from "react";
import Navbar from "../../components/customer/navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { orderAPI } from "../../lib/api";
import PaymentHeader from "../../components/customer/payment/paymentHeader";
import OrderSummary from "../../components/customer/payment/orderSummary";
import QRCodeSection from "../../components/customer/payment/QRCodeSection";
import UploadProofSection from "../../components/customer/payment/uploadProofSection";
import ActionButtons from "../../components/customer/payment/actionButtons";
import PaymentInstructions from "../../components/customer/payment/paymentInstructions";
import { compressImage } from "../../components/customer/payment/imageCompression";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [orderDetails, setOrderDetails] = useState({
    itemName: "Pempek",
    totalPrice: 0,
    orderId: "",
    customerName: "Customer",
  });

  const [originalCartItems, setOriginalCartItems] = useState<any[]>([]);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [proofUploaded, setProofUploaded] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const itemName =
      searchParams.get("item") || sessionStorage.getItem("payment_item_name");
    const totalPrice = parseFloat(
      searchParams.get("total") ||
        sessionStorage.getItem("payment_total") ||
        "0"
    );
    const orderId =
      searchParams.get("orderId") || sessionStorage.getItem("payment_order_id");
    const customerName =
      searchParams.get("customer") ||
      sessionStorage.getItem("payment_customer_name");

    console.log("Order Details:", {
      orderId,
      itemName,
      totalPrice,
      customerName,
    });

    if (!orderId || !itemName || totalPrice === 0) {
      alert("Tidak ada data pesanan. Silakan pesan terlebih dahulu.");
      router.push("/order");
      return;
    }

    setOrderDetails({
      itemName: itemName || "Pempek",
      totalPrice,
      orderId,
      customerName: customerName || "Customer",
    });

    const savedCart = localStorage.getItem("pempek_cart_backup");
    if (savedCart) {
      setOriginalCartItems(JSON.parse(savedCart));
    }

    sessionStorage.setItem("payment_item_name", itemName || "");
    sessionStorage.setItem("payment_total", totalPrice.toString());
    sessionStorage.setItem("payment_order_id", orderId);
    sessionStorage.setItem("payment_customer_name", customerName || "");

    checkExistingProof(orderId);
  }, [searchParams, router]);

  const checkExistingProof = async (orderId: string) => {
    try {
      if (!orderId || orderId === "" || isNaN(Number(orderId))) {
        console.warn("Invalid order ID:", orderId);
        return;
      }

      const orderData = await orderAPI.getById(orderId);
      if (orderData && orderData.payment_proof) {
        setProofUploaded(true);
      }
    } catch (error: any) {
      console.log("Could not check existing proof:", error.message);
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
  const handleCancelOrder = async () => {
    try {
      console.log("🔄 Cancelling order and restoring cart...");

      if (originalCartItems.length > 0) {
        localStorage.setItem("pempek_cart", JSON.stringify(originalCartItems));
        window.dispatchEvent(new Event("cartUpdated"));
        console.log("Cart restored:", originalCartItems);
      }

      if (orderDetails.orderId) {
        try {
          const token = localStorage.getItem("adminToken");
          if (token) {
            await orderAPI.updateStatus(
              orderDetails.orderId,
              "cancelled",
              token
            );
            console.log("✅ Order cancelled in backend");
          } else {
            console.log("⚠️ No admin token, order will remain pending");
          }
        } catch (error) {
          console.log("⚠️ Could not cancel order in backend:", error);
        }
      }

      clearPaymentData();

      alert(
        "Pesanan dibatalkan!\n\n" +
          "Item telah dikembalikan ke keranjang Anda.\n" +
          "Anda bisa melanjutkan belanja atau checkout ulang."
      );

      router.push("/cart");
    } catch (error: any) {
      console.error("❌ Error cancelling order:", error);
      alert("Gagal membatalkan pesanan. Silakan hubungi admin.");
    }
  };

  const clearPaymentData = () => {
    console.log("🧹 Clearing payment session data...");

    sessionStorage.removeItem("payment_item_name");
    sessionStorage.removeItem("payment_total");
    sessionStorage.removeItem("payment_order_id");
    sessionStorage.removeItem("payment_customer_name");
    sessionStorage.removeItem(`payment_uploaded_${orderDetails.orderId}`);

    localStorage.removeItem("pempek_cart_backup");

    console.log("✅ Payment data cleared");
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadError(null);

      if (!file.type.startsWith("image/")) {
        setUploadError("File harus berupa gambar (JPG, PNG, dll)");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError(
          "Ukuran file maksimal 10MB. Silakan pilih gambar yang lebih kecil."
        );
        return;
      }

      console.log("File selected:", file.name);
      setProofImage(file);

      const previewUrl = URL.createObjectURL(file);
      setProofPreview(previewUrl);
    }
  };

  const handleUploadProof = async () => {
    if (!proofImage) {
      setUploadError("Silakan pilih gambar bukti pembayaran terlebih dahulu");
      return;
    }

    if (!orderDetails.orderId) {
      setUploadError("Order ID tidak ditemukan. Silakan pesan ulang.");
      return;
    }

    try {
      setUploading(true);
      setUploadError(null);

      console.log("🔄 Starting compression...");

      const compressedBase64 = await compressImage(proofImage, 1200, 0.8);

      const finalSizeKB = (compressedBase64.length * 3) / 4 / 1024;
      console.log("📤 Uploading", finalSizeKB.toFixed(2), "KB to server...");

      if (finalSizeKB > 2000) {
        throw new Error("Gambar terlalu besar setelah kompresi.");
      }

      await orderAPI.uploadPaymentProof(orderDetails.orderId, compressedBase64);

      sessionStorage.setItem(
        `payment_uploaded_${orderDetails.orderId}`,
        "true"
      );

      setProofUploaded(true);
      setUploadError(null);

      alert("✅ Bukti pembayaran berhasil diupload!");
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Terjadi kesalahan saat mengupload");
      alert("Gagal mengupload bukti pembayaran");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    if (proofPreview && proofPreview.startsWith("blob:")) {
      URL.revokeObjectURL(proofPreview);
    }
    setProofImage(null);
    setProofPreview(null);
    setUploadError(null);
  };

  const handleWhatsAppConfirm = () => {
    const hasProof =
      proofUploaded ||
      sessionStorage.getItem(`payment_uploaded_${orderDetails.orderId}`);

    sessionStorage.setItem("payment_method", "whatsapp");

    setTimeout(() => {
      router.push("/payment-validasi?status=pending");
    }, 1000);
  };

  const handleDirectContinue = () => {
    const hasProof =
      proofUploaded ||
      sessionStorage.getItem(`payment_uploaded_${orderDetails.orderId}`);

    sessionStorage.setItem("payment_method", "upload");

    router.push("/payment-validasi?status=pending");
  };

  useEffect(() => {
    return () => {
      if (proofPreview && proofPreview.startsWith("blob:")) {
        URL.revokeObjectURL(proofPreview);
      }
    };
  }, [proofPreview]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar />

      <div className="pt-20 min-h-screen py-16 mt-6">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
            <PaymentHeader
              onBack={handleCancelOrder}
              orderId={orderDetails.orderId}
            />

            <OrderSummary
              itemName={orderDetails.itemName}
              totalPrice={orderDetails.totalPrice}
              formatPrice={formatPrice}
            />

            <QRCodeSection orderId={orderDetails.orderId} />

            <UploadProofSection
              proofUploaded={proofUploaded}
              proofPreview={proofPreview}
              uploading={uploading}
              uploadError={uploadError}
              onImageSelect={handleImageSelect}
              onUploadProof={handleUploadProof}
              onRemoveImage={handleRemoveImage}
            />

            <ActionButtons
              onWhatsAppConfirm={handleWhatsAppConfirm}
              onDirectContinue={handleDirectContinue}
              proofUploaded={proofUploaded}
            />

            <PaymentInstructions
              totalPrice={orderDetails.totalPrice}
              formatPrice={formatPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment...</p>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  );
}
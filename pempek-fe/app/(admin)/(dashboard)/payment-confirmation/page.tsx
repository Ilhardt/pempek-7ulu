"use client";

import React, { useState, useEffect } from "react";
import { orderAPI } from "../../../lib/api";
import { useRouter } from "next/navigation";
import {
  X,
  Calendar,
  AlertCircle,
  Phone,
  User,
  Clock,
  Package,
  CreditCard,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
} from "lucide-react";

interface PaymentConfirmation {
  id: number;
  customer_name: string;
  created_at: string;
  payment_proof: string | null;
  total_price: number;
  status: string;
  customer_phone: string;
  notes?: string;
}

type FilterStatusType =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "no_proof"
  | "completed"
  | "all";

export default function PaymentConfirmationPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentConfirmation[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<
    PaymentConfirmation[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  // Date filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Status filter - default 'pending'
  const [filterStatus, setFilterStatus] = useState<FilterStatusType>("pending");

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    filterPaymentsByDateAndStatus();
  }, [payments, startDate, endDate, filterStatus]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/login");
        return;
      }

      const data = await orderAPI.getAll(token);

      // ⭐ Ambil SEMUA orders (untuk support filter "all" dan "no_proof")
      const allOrders = Array.isArray(data) ? data : [];

      console.log("All orders:", allOrders);
      setPayments(allOrders);
    } catch (err: any) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterPaymentsByDateAndStatus = () => {
    let filtered = payments;

    // Filter by status
    if (filterStatus === "pending") {
      // Pending + ada bukti bayar
      filtered = filtered.filter(
        (p) => p.status === "pending" && p.payment_proof !== null
      );
    } else if (filterStatus === "confirmed") {
      // Confirmed + ada bukti bayar
      filtered = filtered.filter(
        (p) => p.status === "confirmed" && p.payment_proof !== null
      );
    } else if (filterStatus === "cancelled") {
      // Cancelled + ada bukti bayar
      filtered = filtered.filter(
        (p) => p.status === "cancelled" && p.payment_proof !== null
      );
    } else if (filterStatus === "no_proof") {
      // ⭐ BARU: Semua order yang BELUM upload bukti bayar
      filtered = filtered.filter((p) => p.payment_proof === null);
    } else if (filterStatus === "completed") {
      // Processing/Ready/Completed + ada bukti bayar
      filtered = filtered.filter(
        (p) =>
          (p.status === "processing" ||
            p.status === "ready" ||
            p.status === "completed") &&
          p.payment_proof !== null
      );
    } else if (filterStatus === "all") {
      // ⭐ Semua order yang SUDAH upload bukti bayar
      filtered = filtered.filter((p) => p.payment_proof !== null);
    }

    // Filter by date
    if (startDate || endDate) {
      filtered = filtered.filter((payment) => {
        const paymentDate = new Date(payment.created_at);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        if (start && end) {
          return paymentDate >= start && paymentDate <= end;
        } else if (start) {
          return paymentDate >= start;
        } else if (end) {
          return paymentDate <= end;
        }
        return true;
      });
    }

    setFilteredPayments(filtered);
  };

  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const setTodayFilter = () => {
    const today = new Date().toISOString().split("T")[0];
    setStartDate(today);
    setEndDate(today);
  };

  const handleViewProof = async (paymentId: number) => {
    try {
      const data = await orderAPI.getById(paymentId.toString());
      setSelectedPayment(data);
      setShowModal(true);
    } catch (err: any) {
      alert("Gagal memuat detail: " + err.message);
    }
  };

  const handleConfirmPayment = async (orderId: number) => {
    if (!confirm("Konfirmasi pembayaran order ini?")) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      await orderAPI.updateStatus(orderId.toString(), "confirmed", token);
      alert("✅ Pembayaran dikonfirmasi!");
      setShowModal(false);
      fetchPayments();
    } catch (err: any) {
      alert("Gagal konfirmasi: " + err.message);
    }
  };

  const handleRejectPayment = async (orderId: number) => {

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      await orderAPI.updateStatus(orderId.toString(), "cancelled", token);
      setShowModal(false);
      fetchPayments();
    } catch (err: any) {
      alert("Gagal menolak: " + err.message);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto">
      {/* Header with Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Konfirmasi Pembayaran
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {filterStatus === "pending" && "Pesanan menunggu konfirmasi"}
              {filterStatus === "confirmed" &&
                "Pesanan yang sudah dikonfirmasi"}
              {filterStatus === "cancelled" && "Pesanan yang ditolak"}
              {filterStatus === "no_proof" && "Pesanan tanpa bukti bayar"}
              {filterStatus === "completed" && "Pesanan yang sudah selesai"}
              {filterStatus === "all" && "Semua pesanan dengan bukti bayar"} (
              {filteredPayments.length})
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchPayments}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow p-2 mb-4 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilterStatus("pending")}
            className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === "pending"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Menunggu Konfirmasi
            </div>
          </button>
          <button
            onClick={() => setFilterStatus("confirmed")}
            className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === "confirmed"
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Sudah Dikonfirmasi
            </div>
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === "completed"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-4 h-4" />
              Sudah Selesai
            </div>
          </button>
          <button
            onClick={() => setFilterStatus("cancelled")}
            className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === "cancelled"
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" />
              Ditolak
            </div>
          </button>
          <button
            onClick={() => setFilterStatus("all")}
            className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === "all"
                ? "bg-purple-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Semua Bukti Bayar
            </div>
          </button>
          <button
            onClick={() => setFilterStatus("no_proof")}
            className={`flex-1 min-w-fit px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              filterStatus === "no_proof"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Whatsapp
            </div>
          </button>
        </div>

        {/* Date Filter Panel */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-700">Filter Tanggal</h3>
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              {showDateFilter ? "Sembunyikan" : "Tampilkan"}
            </button>
          </div>

          {showDateFilter && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Dari Tanggal
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Sampai Tanggal
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-600"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={setTodayFilter}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Hari Ini
                  </button>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={resetDateFilter}
                    className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {(startDate || endDate) && (
                <div className="mt-3 text-sm text-gray-600">
                  Menampilkan {filteredPayments.length} dari{" "}
                  {filterStatus === "all"
                    ? payments.filter((p) => p.payment_proof !== null).length
                    : filterStatus === "no_proof"
                    ? payments.filter((p) => p.payment_proof === null).length
                    : payments.filter((p) => {
                        const hasProof = p.payment_proof !== null;
                        if (filterStatus === "pending")
                          return p.status === "pending" && hasProof;
                        if (filterStatus === "confirmed")
                          return p.status === "confirmed" && hasProof;
                        if (filterStatus === "cancelled")
                          return p.status === "cancelled" && hasProof;
                        return (
                          (p.status === "processing" ||
                            p.status === "ready" ||
                            p.status === "completed") &&
                          hasProof
                        );
                      }).length}{" "}
                  pesanan
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {filteredPayments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600 text-lg">
            {payments.length === 0
              ? "✅ Tidak ada pembayaran yang perlu dikonfirmasi"
              : filterStatus === "pending"
              ? "Tidak ada pembayaran yang menunggu konfirmasi"
              : filterStatus === "confirmed"
              ? "Tidak ada pembayaran yang sudah dikonfirmasi"
              : filterStatus === "cancelled"
              ? "Tidak ada pembayaran yang ditolak"
              : filterStatus === "no_proof"
              ? "Tidak ada pesanan tanpa bukti bayar"
              : filterStatus === "completed"
              ? "Tidak ada pesanan yang sudah selesai"
              : "Tidak ada data"}
            {(startDate || endDate) && " pada periode yang dipilih"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div
                className={`text-white p-4 rounded-t-xl ${
                  payment.status === "pending"
                    ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                    : payment.status === "confirmed"
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : payment.status === "cancelled"
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium opacity-90">
                    Order ID
                  </span>
                  <span className="text-lg font-bold">
                    #{payment.id.toString().padStart(6, "0")}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Pelanggan</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {payment.customer_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Telepon</p>
                    <p className="text-sm text-gray-700">
                      {payment.customer_phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Tanggal</p>
                    <p className="text-sm text-gray-700">
                      {formatDate(payment.created_at)}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-700">
                      Total
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      {formatPrice(payment.total_price)}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${
                    payment.status === "pending"
                      ? "bg-yellow-50 text-yellow-700"
                      : payment.status === "confirmed"
                      ? "bg-green-50 text-green-700"
                      : payment.status === "cancelled"
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-50 text-blue-700"
                  }`}
                >
                  {payment.status === "pending" && (
                    <AlertCircle className="w-4 h-4" />
                  )}
                  {payment.status === "confirmed" && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  {payment.status === "cancelled" && (
                    <XCircle className="w-4 h-4" />
                  )}
                  {(payment.status === "processing" ||
                    payment.status === "ready" ||
                    payment.status === "completed") && (
                    <Package className="w-4 h-4" />
                  )}
                  <span className="text-xs font-semibold">
                    {payment.status === "pending" && "Menunggu Konfirmasi"}
                    {payment.status === "confirmed" && "Sudah Dikonfirmasi"}
                    {payment.status === "cancelled" && "Ditolak"}
                    {payment.status === "processing" && "Sedang Diproses"}
                    {payment.status === "ready" && "Siap Diambil"}
                    {payment.status === "completed" && "Selesai"}
                  </span>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  onClick={() => handleViewProof(payment.id)}
                  className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
                    payment.status === "pending"
                      ? "bg-orange-500 hover:bg-orange-600 text-white"
                      : payment.status === "confirmed"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : payment.status === "cancelled"
                      ? "bg-gray-500 hover:bg-gray-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  {payment.payment_proof
                    ? "Lihat Detail & Bukti Bayar"
                    : "Lihat Detail Pesanan"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detail */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6 flex justify-between items-center rounded-t-2xl z-10">
              <h2 className="text-xl font-bold text-gray-900">
                Detail Pembayaran
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Order Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-orange-500" />
                      Informasi Pesanan
                    </h3>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID</span>
                        <span className="font-semibold text-gray-900">
                          #{selectedPayment.id.toString().padStart(6, "0")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nama</span>
                        <span className="font-semibold text-gray-900">
                          {selectedPayment.customer_name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telepon</span>
                        <span className="font-semibold text-gray-900">
                          {selectedPayment.customer_phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tanggal</span>
                        <span className="font-semibold text-gray-900">
                          {formatDate(selectedPayment.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedPayment.notes && (
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                        Catatan Pesanan
                      </h3>
                      <p className="text-sm text-gray-700">
                        {selectedPayment.notes}
                      </p>
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">
                      Produk Dipesan
                    </h3>
                    <div className="space-y-2">
                      {selectedPayment.items &&
                        selectedPayment.items.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center text-sm bg-white rounded-lg p-2.5"
                          >
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.menu_name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <span className="font-semibold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-xl text-orange-600">
                        {formatPrice(selectedPayment.total_price)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Payment Proof */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-orange-500" />
                      Bukti Pembayaran
                    </h3>

                    {selectedPayment.payment_proof ? (
                      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center min-h-[200px]">
                        <img
                          src={selectedPayment.payment_proof}
                          alt="Bukti Pembayaran"
                          className="max-w-full max-h-[400px] rounded-lg shadow cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setShowImageModal(true)}
                          onError={(e) => {
                            console.error("Failed to load image");
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x300?text=Image+Load+Failed";
                          }}
                        />
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="font-semibold text-gray-700">
                          Belum ada bukti pembayaran
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Customer belum mengupload bukti transfer
                        </p>
                      </div>
                    )}

                    {selectedPayment.payment_proof && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        💡 Klik gambar untuk memperbesar
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {selectedPayment.status === "pending" && (
                      <>
                        {/* Info jika tidak ada bukti bayar */}
                        {!selectedPayment.payment_proof && (
                          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-3">
                            <div className="flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                              <div>
                                <p className="font-semibold text-yellow-800 text-sm">
                                  Konfirmasi Via WhatsApp
                                </p>
                                <p className="text-xs text-yellow-700 mt-1">
                                  Customer belum upload bukti bayar. Pastikan
                                  Anda sudah mengonfirmasi pembayaran via
                                  WhatsApp sebelum menerima pesanan ini.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() =>
                            handleConfirmPayment(selectedPayment.id)
                          }
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          {selectedPayment.payment_proof
                            ? "Terima Pembayaran"
                            : "Konfirmasi Pembayaran (Via WA)"}
                        </button>
                        <button
                          onClick={() =>
                            handleRejectPayment(selectedPayment.id)
                          }
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                          <XCircle className="w-5 h-5" />
                          Tolak Pembayaran
                        </button>
                      </>
                    )}

                    {selectedPayment.status === "confirmed" && (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                        <CheckCircle className="w-16 h-16 mx-auto mb-3 text-green-600" />
                        <p className="font-bold text-lg text-green-800">
                          Pembayaran Sudah Dikonfirmasi
                        </p>
                        <p className="text-sm text-green-600 mt-2">
                          Order sedang diproses
                        </p>
                      </div>
                    )}

                    {selectedPayment.status === "cancelled" && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                        <XCircle className="w-16 h-16 mx-auto mb-3 text-red-600" />
                        <p className="font-bold text-lg text-red-800">
                          Pembayaran Ditolak
                        </p>
                        <p className="text-sm text-red-600 mt-2">
                          Order dibatalkan
                        </p>
                      </div>
                    )}

                    {(selectedPayment.status === "processing" ||
                      selectedPayment.status === "ready" ||
                      selectedPayment.status === "completed") && (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 text-center">
                        <Package className="w-16 h-16 mx-auto mb-3 text-blue-600" />
                        <p className="font-bold text-lg text-blue-800">
                          {selectedPayment.status === "processing" &&
                            "Pesanan Sedang Diproses"}
                          {selectedPayment.status === "ready" &&
                            "Pesanan Siap Diambil"}
                          {selectedPayment.status === "completed" &&
                            "Pesanan Sudah Selesai"}
                        </p>
                        <p className="text-sm text-blue-600 mt-2">
                          {selectedPayment.status === "processing" &&
                            "Order sedang dibuat"}
                          {selectedPayment.status === "ready" &&
                            "Menunggu customer mengambil"}
                          {selectedPayment.status === "completed" &&
                            "Transaksi selesai"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Image Modal */}
      {showImageModal && selectedPayment?.payment_proof && (
        <div
          className="fixed inset-0 backdrop-blur-xs bg-opacity-95 flex items-center justify-center z-[100] p-4"
          onClick={() => setShowImageModal(false)}
        >
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10 bg-black bg-opacity-50 rounded-full p-2"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-[95vw] max-h-[95vh] flex items-center justify-center">
            <img
              src={selectedPayment.payment_proof}
              alt="Bukti Pembayaran - Fullscreen"
              className="max-w-full max-h-[95vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                console.error("Failed to load fullscreen image");
                e.currentTarget.src =
                  "https://via.placeholder.com/800x600?text=Image+Load+Failed";
              }}
            />
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-full">
            💡 Klik di mana saja untuk menutup
          </div>
        </div>
      )}
    </div>
  );
}

// app/(admin)/(dashboard)/orders/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { orderAPI } from "../../../lib/api";
import { useRouter } from "next/navigation";
import { X, Calendar } from "lucide-react";

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_price: number;
  status: string;
  notes?: string;
  item_count: number;
  created_at: string;
  payment_proof?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  // Date filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDateFilter, setShowDateFilter] = useState(false);

  // Status filter
  const [statusFilter, setStatusFilter] = useState("all");

  // Status options dengan label (UPDATED)
  const statusOptions = [
    {
      value: "pending",
      label: "Menunggu Pembayaran",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "confirmed",
      label: "Pembayaran Dikonfirmasi",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "processing",
      label: "Sedang Diproses",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "ready",
      label: "Siap Diambil",
      color: "bg-indigo-100 text-indigo-800",
    },
    {
      value: "completed",
      label: "Selesai",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Dibatalkan",
      color: "bg-red-100 text-red-800",
    },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, startDate, endDate, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/login");
        return;
      }
      const data = await orderAPI.getAll(token);
      setOrders(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Gagal memuat pesanan");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by date
    if (startDate || endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start) start.setHours(0, 0, 0, 0);
        if (end) end.setHours(23, 59, 59, 999);

        if (start && end) {
          return orderDate >= start && orderDate <= end;
        } else if (start) {
          return orderDate >= start;
        } else if (end) {
          return orderDate <= end;
        }
        return true;
      });
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
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

  const handleViewDetail = async (orderId: number) => {
    try {
      const data = await orderAPI.getById(orderId.toString());
      setSelectedOrder(data);
      setShowDetailModal(true);
    } catch (err: any) {
      alert("Gagal memuat detail: " + err.message);
    }
  };

  const handleUpdateStatusClick = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      await orderAPI.updateStatus(
        selectedOrder.id.toString(),
        newStatus,
        token
      );
      alert("Status berhasil diupdate!");
      setShowStatusModal(false);
      setShowDetailModal(false);
      fetchOrders();
    } catch (err: any) {
      alert("Gagal update status: " + err.message);
    }
  };

  const getStatusLabel = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.label : status;
  };

  const getStatusColor = (status: string) => {
    const option = statusOptions.find((opt) => opt.value === status);
    return option ? option.color : "bg-gray-100 text-gray-800";
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
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      {/* Header with Filters */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Daftar Pesanan
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDateFilter(!showDateFilter)}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              <Calendar className="w-4 h-4" />
              Filter
            </button>
            <button
              onClick={fetchOrders}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showDateFilter && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">Filter Pesanan</h3>

            {/* Date Filter */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Filter Tanggal
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Dari Tanggal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-500"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Sampai Tanggal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-500"
                  />
                </div>
                <button
                  onClick={setTodayFilter}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Hari Ini
                </button>
                <button
                  onClick={resetDateFilter}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold"
                >
                  Reset Tanggal
                </button>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                Filter Status
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    statusFilter === "all"
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Semua ({orders.length})
                </button>
                {statusOptions.map((option) => {
                  const count = orders.filter(
                    (o) => o.status === option.value
                  ).length;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setStatusFilter(option.value)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        statusFilter === option.value
                          ? option.color + " ring-2 ring-offset-1 ring-gray-400"
                          : option.color + " opacity-70 hover:opacity-100"
                      }`}
                    >
                      {option.label} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filter Info */}
            <div className="mt-3 text-sm text-gray-600 flex justify-between items-center">
              <span>
                Menampilkan {filteredOrders.length} dari {orders.length} pesanan
              </span>
              {(startDate || endDate || statusFilter !== "all") && (
                <button
                  onClick={() => {
                    resetDateFilter();
                    setStatusFilter("all");
                  }}
                  className="text-red-600 hover:text-red-700 font-semibold"
                >
                  Reset Semua Filter
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 sm:p-12 text-center">
          <p className="text-gray-600 text-lg">
            {orders.length === 0
              ? "Belum ada pesanan"
              : "Tidak ada pesanan yang sesuai dengan filter"}
          </p>
        </div>
      ) : (
        <>
          {/* Mobile View */}
          <div className="block lg:hidden space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow p-4 text-gray-500"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-500">Order ID</p>
                      <p className="font-bold">
                        #{order.id.toString().padStart(6, "0")}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Pelanggan</p>
                    <p className="font-semibold">{order.customer_name}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Tanggal</p>
                    <p className="text-sm">{formatDate(order.created_at)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-bold text-orange-600">
                      {formatPrice(order.total_price)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(order.id)}
                      className="flex-1 bg-orange-200 hover:bg-orange-300 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleUpdateStatusClick(order)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden lg:block bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Item
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-gray-600">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold">
                      #{order.id.toString().padStart(6, "0")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm">
                      {order.item_count} item
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                      {formatPrice(order.total_price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewDetail(order.id)}
                        className="bg-orange-200 hover:bg-orange-300 text-gray-800 px-6 py-2 rounded-full text-sm font-semibold"
                      >
                        Cek Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal Detail Pesanan (sama seperti sebelumnya) */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 text-gray-500 bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 relative my-8">
            <button
              onClick={() => setShowDetailModal(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Detail Pesanan
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                <span className="font-semibold">Nama</span>
                <span>{selectedOrder.customer_name}</span>
              </div>

              <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                <span className="font-semibold">Telepon</span>
                <span>{selectedOrder.customer_phone}</span>
              </div>

              <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                <span className="font-semibold">Order ID</span>
                <span>#{selectedOrder.id.toString().padStart(6, "0")}</span>
              </div>

              <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                <span className="font-semibold">Tanggal Pesanan</span>
                <span>{formatDate(selectedOrder.created_at)}</span>
              </div>

              <div className="py-2 border-b">
                <span className="font-semibold block mb-2 text-sm sm:text-base">
                  Produk
                </span>
                {selectedOrder.items &&
                  selectedOrder.items.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="ml-4 text-sm text-gray-700 flex justify-between items-start"
                    >
                      <div>
                        <span>
                          • {item.menu_name} ({item.quantity}x)
                        </span>
                        {item.notes && (
                          <p className="text-xs text-gray-500 italic ml-4">
                            📝 {item.notes}
                          </p>
                        )}
                      </div>
                      <span className="font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="py-2 border-b text-sm sm:text-base">
                <span className="font-semibold block mb-2">
                  Alamat Pengambilan
                </span>
                <span className="text-gray-700">
                  {selectedOrder.customer_address || "Diambil di outlet"}
                </span>
              </div>

              <div className="py-2 border-b text-sm sm:text-base">
                <span className="font-semibold block mb-2">Catatan</span>
                <span className="text-gray-700">
                  {selectedOrder.notes || "-"}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                <span className="font-semibold">Status</span>
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b text-sm sm:text-base">
                <span className="font-semibold">Total Bayar</span>
                <span className="text-lg sm:text-xl font-bold text-orange-600">
                  {formatPrice(selectedOrder.total_price)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleUpdateStatusClick(selectedOrder);
                  }}
                  className="flex-1 bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-full font-semibold"
                >
                  Update Status
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 bg-orange-200 hover:bg-orange-300 text-gray-800 py-3 rounded-full font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Update Status (sama seperti sebelumnya) */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 text-gray-500 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Update Status
            </h2>

            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Order #{selectedOrder.id.toString().padStart(6, "0")} -{" "}
                {selectedOrder.customer_name}
              </p>

              <label className="block text-sm font-semibold mb-3">
                Pilih Status Baru:
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 text-sm sm:text-base"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleUpdateStatus}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold"
              >
                Simpan
              </button>
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-full font-semibold"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

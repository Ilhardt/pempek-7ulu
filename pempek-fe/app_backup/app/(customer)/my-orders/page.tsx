"use client";

import React, { useState, useEffect } from "react";
import { orderAPI } from "../../lib/api";
import {
  Clock,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import MyOrdersHeader from "../../components/customer/my-orders/myOrdersHeader";
import SearchBox from "../../components/customer/my-orders/searchBox";
import OrderCard from "../../components/customer/my-orders/orderCard";
import OrderDetailModal from "../../components/customer/my-orders/orderDetailModal";
import StatusStyles from "../../components/customer/my-orders/statusStyles";

export default function MyOrdersPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedPhone = localStorage.getItem("customer_phone");
    if (savedPhone) {
      setPhoneNumber(savedPhone);
    }
  }, []);

  const handleSearch = async (phone?: string) => {
    const searchPhone = phone || phoneNumber;

    if (!searchPhone) {
      setError("Masukkan nomor telepon");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await orderAPI.getByPhone(searchPhone);
      setOrders(data);

      localStorage.setItem("customer_phone", searchPhone);

      if (data.length === 0) {
        setError("Tidak ada pesanan ditemukan untuk nomor ini");
      }
    } catch (err: any) {
      setError("Gagal memuat pesanan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setPhoneNumber("");
    setOrders([]);
    setError("");
    localStorage.removeItem("customer_phone");
  };

  const handleViewDetail = async (orderId: number) => {
    try {
      const data = await orderAPI.getById(orderId.toString());
      setSelectedOrder(data);
      setShowModal(true);
    } catch (err: any) {
      alert("Gagal memuat detail: " + err.message);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: any = {
      pending: {
        label: "Menunggu Pembayaran",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      confirmed: {
        label: "Pembayaran Dikonfirmasi",
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
      },
      processing: {
        label: "Sedang Diproses",
        color: "bg-purple-100 text-purple-800",
        icon: Package,
      },
      ready: {
        label: "Siap Diambil",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      completed: {
        label: "Selesai",
        color: "bg-gray-100 text-gray-800",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Dibatalkan",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };
    return statusMap[status] || statusMap["pending"];
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

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #FEF3C7 0%, #FED7AA 50%, #FECACA 100%)",
      }}
    >
      <MyOrdersHeader />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px" }}>
        <SearchBox
          phoneNumber={phoneNumber}
          loading={loading}
          error={error}
          onPhoneChange={setPhoneNumber}
          onSearch={handleSearch}
          onClear={handleClear}
        />

        {/* Orders List */}
        {orders.length > 0 && (
          <div
            style={{
              display: "grid",
              gap: "20px",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            }}
          >
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetail={handleViewDetail}
                getStatusInfo={getStatusInfo}
                formatPrice={formatPrice}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>

      <OrderDetailModal
        show={showModal}
        order={selectedOrder}
        onClose={() => setShowModal(false)}
        getStatusInfo={getStatusInfo}
        formatPrice={formatPrice}
        formatDate={formatDate}
      />

      <StatusStyles />
    </div>
  );
}
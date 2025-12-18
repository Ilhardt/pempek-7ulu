"use client";

import React from "react";

interface OrderCardProps {
  order: any;
  onViewDetail: (orderId: number) => void;
  getStatusInfo: (status: string) => any;
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
}

export default function OrderCard({
  order,
  onViewDetail,
  getStatusInfo,
  formatPrice,
  formatDate,
}: OrderCardProps) {
  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "25px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
        transition: "all 0.3s",
        cursor: "pointer",
      }}
      onClick={() => onViewDetail(order.id)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
      }}
    >
      {/* Order ID & Status */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#111827",
          }}
        >
          #{order.id.toString().padStart(6, "0")}
        </span>
        <span
          style={{
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
          className={statusInfo.color}
        >
          <StatusIcon style={{ width: "14px", height: "14px" }} />
          {statusInfo.label}
        </span>
      </div>

      {/* Customer Info */}
      <div style={{ marginBottom: "15px" }}>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "600",
            color: "#111827",
            marginBottom: "5px",
          }}
        >
          {order.customer_name}
        </p>
        <p style={{ fontSize: "14px", color: "#6B7280" }}>
          📞 {order.customer_phone}
        </p>
      </div>

      {/* Order Details */}
      <div
        style={{
          padding: "15px",
          background: "#F9FAFB",
          borderRadius: "12px",
          marginBottom: "15px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#6B7280",
            marginBottom: "8px",
          }}
        >
          📅 {formatDate(order.created_at)}
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "#6B7280",
            marginBottom: "8px",
          }}
        >
          📦 {order.item_count} item
        </p>
        <p
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#F59E0B",
            marginTop: "10px",
          }}
        >
          {formatPrice(order.total_price)}
        </p>
      </div>

      {/* Action Button */}
      <button
        style={{
          width: "100%",
          padding: "12px",
          background: "#FEF3C7",
          color: "#92400E",
          border: "none",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Lihat Detail →
      </button>
    </div>
  );
}

"use client";

import React from "react";

interface OrderDetailModalProps {
  show: boolean;
  order: any;
  onClose: () => void;
  getStatusInfo: (status: string) => any;
  formatPrice: (price: number) => string;
  formatDate: (dateString: string) => string;
}

export default function OrderDetailModal({
  show,
  order,
  onClose,
  getStatusInfo,
  formatPrice,
  formatDate,
}: OrderDetailModalProps) {
  if (!show || !order) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          borderRadius: "20px",
          padding: "30px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#6B7280",
          }}
        >
          ×
        </button>

        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#111827",
          }}
        >
          Detail Pesanan #{order.id.toString().padStart(6, "0")}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div
            style={{
              paddingBottom: "15px",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                marginBottom: "5px",
              }}
            >
              Nama Customer
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              {order.customer_name}
            </p>
          </div>

          <div
            style={{
              paddingBottom: "15px",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                marginBottom: "5px",
              }}
            >
              Telepon
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              {order.customer_phone}
            </p>
          </div>

          <div
            style={{
              paddingBottom: "15px",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                marginBottom: "5px",
              }}
            >
              Tanggal Pesanan
            </p>
            <p
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#111827",
              }}
            >
              {formatDate(order.created_at)}
            </p>
          </div>

          {order.notes && (
            <div
              style={{
                paddingBottom: "15px",
                borderBottom: "1px solid #E5E7EB",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#6B7280",
                  marginBottom: "5px",
                }}
              >
                Catatan
              </p>
              <p style={{ fontSize: "16px", color: "#111827" }}>
                {order.notes}
              </p>
            </div>
          )}

          <div
            style={{
              paddingBottom: "15px",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                marginBottom: "10px",
              }}
            >
              Item Pesanan
            </p>
            {order.items &&
              order.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px",
                    background: "#F9FAFB",
                    borderRadius: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#111827" }}>
                    {item.menu_name} x{item.quantity}
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
          </div>

          <div
            style={{
              paddingBottom: "15px",
              borderBottom: "2px solid #F59E0B",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#6B7280",
                marginBottom: "5px",
              }}
            >
              Status
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "8px 15px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
              }}
              className={getStatusInfo(order.status).color}
            >
              {getStatusInfo(order.status).label}
            </span>
          </div>

          <div style={{ paddingTop: "15px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  color: "#111827",
                }}
              >
                TOTAL
              </p>
              <p
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#F59E0B",
                }}
              >
                {formatPrice(order.total_price)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
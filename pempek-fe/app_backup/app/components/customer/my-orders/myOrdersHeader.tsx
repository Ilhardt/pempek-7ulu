"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";

export default function MyOrdersHeader() {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <button
          onClick={() => window.history.back()}
          style={{
            padding: "10px",
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ArrowLeft style={{ width: "24px", height: "24px", color: "#111827" }} />
        </button>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#111827" }}>
          Pesanan Saya
        </h1>
      </div>
    </div>
  );
}
"use client";

import React from "react";
import { Search } from "lucide-react";

interface SearchBoxProps {
  phoneNumber: string;
  loading: boolean;
  error: string;
  onPhoneChange: (phone: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export default function SearchBox({
  phoneNumber,
  loading,
  error,
  onPhoneChange,
  onSearch,
  onClear,
}: SearchBoxProps) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "30px",
        marginBottom: "30px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "600",
          marginBottom: "20px",
          color: "#111827",
        }}
      >
        🔍 Cek Status Pesanan
      </h2>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Masukkan nomor telepon (contoh: 08123456789)"
          style={{
            flex: "1",
            minWidth: "250px",
            padding: "15px 20px",
            border: "2px solid #E5E7EB",
            borderRadius: "12px",
            fontSize: "16px",
            outline: "none",
            color: "#111827",
          }}
          onKeyPress={(e) => e.key === "Enter" && onSearch()}
        />

        {/* Tombol Clear */}
        {phoneNumber && (
          <button
            onClick={onClear}
            style={{
              padding: "15px 20px",
              background: "#DC2626",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            ✕ Clear
          </button>
        )}

        <button
          onClick={() => onSearch()}
          disabled={loading}
          style={{
            padding: "15px 30px",
            background: loading ? "#9CA3AF" : "#F59E0B",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Search style={{ width: "20px", height: "20px" }} />
          {loading ? "Mencari..." : "Cari Pesanan"}
        </button>
      </div>
      {error && (
        <p style={{ marginTop: "15px", color: "#DC2626", fontSize: "14px" }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
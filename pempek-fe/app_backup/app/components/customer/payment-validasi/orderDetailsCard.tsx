// components/customer/payment-validasi/OrderDetailsCard.tsx
import React from "react";
import { MessageCircle } from "lucide-react";

interface OrderDetailsCardProps {
  orderId: string;
  customerName: string;
  itemName: string;
  totalPrice: number;
  paymentMethod: "upload" | "whatsapp";
  status: "pending" | "approved" | "rejected";
}

export default function OrderDetailsCard({
  orderId,
  customerName,
  itemName,
  totalPrice,
  paymentMethod,
  status,
}: OrderDetailsCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    })
      .format(price)
      .replace("IDR", "Rp");
  };

  const getStatusColors = () => {
    // Jika metode pembayaran via WhatsApp dan masih pending
    if (paymentMethod === "whatsapp" && status === "pending") {
      return {
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
      };
    }

    switch (status) {
      case "approved":
        return {
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "rejected":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        };
    }
  };

  const colors = getStatusColors();

  return (
    <div
      className={`${colors.bgColor} border-2 ${colors.borderColor} rounded-2xl p-6 mb-8`}
    >
      <h2 className="font-bold text-gray-900 text-xl mb-4">
        📋 Detail Pesanan
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Order ID:</span>
          <span className="font-mono font-bold text-gray-900 text-lg">
            #{orderId}
          </span>
        </div>

        <div className="border-t border-gray-300 pt-3"></div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Nama Pemesan:</span>
          <span className="font-semibold text-gray-900">{customerName}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Pesanan:</span>
          <span className="font-semibold text-gray-900">{itemName}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Total Pembayaran:</span>
          <span className="font-bold text-red-600 text-xl">
            {formatPrice(totalPrice)}
          </span>
        </div>

        <div className="border-t border-gray-300 pt-3"></div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Metode Konfirmasi:</span>
          <span className="font-semibold text-gray-900 flex items-center gap-2">
            {paymentMethod === "whatsapp" ? (
              <>
                <MessageCircle className="w-4 h-4 text-green-600" />
                WhatsApp
              </>
            ) : (
              <>QRIS</>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

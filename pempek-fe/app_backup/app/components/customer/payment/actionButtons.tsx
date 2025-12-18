// components/customer/payment/actionButtons.tsx
import React from "react";
import { CheckCircle, MessageCircle, AlertCircle } from "lucide-react";

interface ActionButtonsProps {
  onWhatsAppConfirm: () => void;
  onDirectContinue: () => void;
  proofUploaded: boolean;
}

export default function ActionButtons({
  onWhatsAppConfirm,
  onDirectContinue,
  proofUploaded,
}: ActionButtonsProps) {
  return (
    <div className="space-y-6 mb-8">
      {/* Divider */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm font-semibold text-gray-500">
            Pilih Cara Konfirmasi
          </span>
        </div>
      </div>

      {/* Primary Action: Upload & Continue */}
      <div className="space-y-3">
        <button
          onClick={onDirectContinue}
          disabled={!proofUploaded}
          className={`w-full font-bold text-lg py-5 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 transform ${
            proofUploaded
              ? "bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 hover:shadow-xl hover:scale-[1.02]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <CheckCircle className="w-6 h-6" />
          Lanjutkan ke Halaman Validasi
        </button>
        <p className="text-center text-sm text-gray-600">
          {proofUploaded
            ? "✅ Bukti pembayaran sudah diupload, silakan lanjut untuk validasi"
            : "⚠️ Upload bukti pembayaran terlebih dahulu untuk melanjutkan"}
        </p>
      </div>

      {/* Divider with OR */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-xs font-medium text-gray-400">
            ATAU
          </span>
        </div>
      </div>

      {/* Alternative: WhatsApp Admin Help */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-blue-900 text-base mb-1">
              ⚠️ Mengalami Masalah dengan QRIS?
            </h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Jika Anda kesulitan melakukan pembayaran via QRIS, hubungi admin
              kami untuk mendapatkan metode pembayaran alternatif seperti:
            </p>
            <ul className="mt-2 space-y-1 text-blue-800 text-sm">
              <li>💳 Transfer Bank (BCA, BRI, Mandiri, dll)</li>
              <li>💵 Pembayaran Cash (COD)</li>
              <li>📱 E-Wallet lainnya (OVO, GoPay, dll)</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onWhatsAppConfirm}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-base py-4 rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3"
        >
          <MessageCircle className="w-5 h-5" />
          Hubungi Admin untuk Bantuan
        </button>

        <div className="bg-white/70 rounded-lg p-3">
          <p className="text-xs text-blue-800 text-center font-medium">
            ⚡ Admin biasanya merespons dalam 5-10 menit
          </p>
        </div>
      </div>
    </div>
  );
}

// components/customer/payment-validasi/ActionButtons.tsx
'use client';

import React from 'react';
import { Home, MessageCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ActionButtonsProps {
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: 'upload' | 'whatsapp';
  isChecking: boolean;
  onRefresh: () => void;
  onWhatsAppContact: () => void;
}

export default function ActionButtons({
  status,
  paymentMethod,
  isChecking,
  onRefresh,
  onWhatsAppContact
}: ActionButtonsProps) {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {status === 'pending' && (
        <>
          {/* Refresh button hanya untuk yang upload bukti */}
          {paymentMethod === 'upload' && (
            <button
              onClick={onRefresh}
              disabled={isChecking}
              className="w-full bg-blue-600 text-white font-bold text-lg py-5 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-6 h-6 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Mengecek...' : 'Refresh Status'}
            </button>
          )}

          <button
            onClick={onWhatsAppContact}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-lg py-5 rounded-full hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 transform hover:scale-[1.02]"
          >
            <MessageCircle className="w-6 h-6" />
            {paymentMethod === 'whatsapp' 
              ? '💬 Hubungi Admin untuk Metode Alternatif' 
              : 'Hubungi Admin via WhatsApp'}
          </button>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <p className="text-center text-sm text-blue-800 font-medium">
              {paymentMethod === 'whatsapp' 
                ? '🤝 Admin siap membantu Anda dengan opsi pembayaran lain (Transfer Bank, Cash, dll)'
                : '💡 Untuk mempercepat validasi, hubungi admin kami'}
            </p>
          </div>
        </>
      )}

      {status === 'approved' && (
        <button
          onClick={() => router.push('/')}
          className="w-full bg-blue-600 text-white font-bold text-lg py-5 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
        >
          <Home className="w-6 h-6" />
          Kembali ke Beranda
        </button>
      )}

      {status === 'rejected' && (
        <>
          <button
            onClick={onWhatsAppContact}
            className="w-full bg-green-600 text-white font-bold text-lg py-5 rounded-full hover:bg-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-6 h-6" />
            Hubungi Admin
          </button>
          
          <button
            onClick={() => router.push('/order')}
            className="w-full bg-red-600 text-white font-bold text-lg py-5 rounded-full hover:bg-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            Pesan Ulang
          </button>
        </>
      )}
    </div>
  );
}
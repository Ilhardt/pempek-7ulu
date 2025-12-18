// components/customer/payment-validasi/StatusHeader.tsx
import React from 'react';
import { CheckCircle, Clock, MessageCircle, XCircle } from 'lucide-react';

interface StatusHeaderProps {
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: 'upload' | 'whatsapp';
}

export default function StatusHeader({ status, paymentMethod }: StatusHeaderProps) {
  const getStatusConfig = () => {
    // Jika metode pembayaran via WhatsApp dan masih pending
    if (paymentMethod === 'whatsapp' && status === 'pending') {
      return {
        icon: <MessageCircle className="w-24 h-24 text-green-500" />,
        title: 'Perlu Bantuan Admin? 🤝',
        description: 'Anda memilih untuk berkonsultasi dengan admin kami terkait metode pembayaran alternatif.'
      };
    }

    switch (status) {
      case 'approved':
        return {
          icon: <CheckCircle className="w-24 h-24 text-green-500" />,
          title: 'Pembayaran Terverifikasi! ✅',
          description: 'Selamat! Pembayaran Anda telah dikonfirmasi oleh admin.'
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-24 h-24 text-red-500" />,
          title: 'Pembayaran Ditolak ❌',
          description: 'Maaf, pembayaran Anda tidak dapat diverifikasi.'
        };
      default: // pending dengan upload bukti
        return {
          icon: <Clock className="w-24 h-24 text-amber-500" />,
          title: 'Menunggu Validasi Admin ⏳',
          description: 'Pembayaran Anda sedang dalam proses pengecekan.'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="mb-6 animate-pulse">
        {statusConfig.icon}
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        {statusConfig.title}
      </h1>
      
      <p className="text-lg text-gray-600 mb-6">
        {statusConfig.description}
      </p>
    </div>
  );
}
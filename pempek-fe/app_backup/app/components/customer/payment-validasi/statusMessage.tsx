// components/customer/payment-validasi/StatusMessage.tsx
import React from 'react';

interface StatusMessageProps {
  status: 'pending' | 'approved' | 'rejected';
  paymentMethod: 'upload' | 'whatsapp';
}

export default function StatusMessage({ status, paymentMethod }: StatusMessageProps) {
  const getStatusConfig = () => {
    // Jika metode pembayaran via WhatsApp dan masih pending
    if (paymentMethod === 'whatsapp' && status === 'pending') {
      return {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        message: 'Silakan hubungi admin kami via WhatsApp untuk mengkonfirmasi pembayaran Anda. Setelah admin mengkonfirmasi, pesanan akan segera diproses.'
      };
    }

    switch (status) {
      case 'approved':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          message: 'Pesanan Anda sedang diproses dan akan segera disiapkan. Terima kasih!'
        };
      case 'rejected':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          message: 'Silakan hubungi kami untuk informasi lebih lanjut atau lakukan pemesanan ulang.'
        };
      default: // pending dengan upload bukti
        return {
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-800',
          message: 'Admin kami akan segera memverifikasi bukti pembayaran Anda. Mohon tunggu beberapa saat.'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className={`${statusConfig.bgColor} border-2 ${statusConfig.borderColor} rounded-2xl p-6 mb-8`}>
      <p className={`${statusConfig.textColor} text-center font-medium leading-relaxed`}>
        {statusConfig.message}
      </p>
    </div>
  );
}
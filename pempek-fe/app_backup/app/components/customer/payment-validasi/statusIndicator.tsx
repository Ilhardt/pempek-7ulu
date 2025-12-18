// components/customer/payment-validasi/StatusIndicator.tsx
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface StatusIndicatorProps {
  isChecking: boolean;
  lastChecked: Date | null;
}

export default function StatusIndicator({ isChecking, lastChecked }: StatusIndicatorProps) {
  return (
    <div className="mb-6 flex items-center justify-center gap-2 text-sm text-gray-600">
      <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
      <span>
        {isChecking ? 'Mengecek status...' : 'Auto-refresh aktif'}
        {lastChecked && (
          <span className="ml-2 text-xs text-gray-500">
            (terakhir dicek: {lastChecked.toLocaleTimeString('id-ID')})
          </span>
        )}
      </span>
    </div>
  );
}
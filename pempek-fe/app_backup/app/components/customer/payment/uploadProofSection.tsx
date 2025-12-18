// components/customer/payment/uploadProofSection.tsx
import React from 'react';
import { Upload, CheckCircle, X, Loader2, AlertCircle } from 'lucide-react';

interface UploadProofSectionProps {
  proofUploaded: boolean;
  proofPreview: string | null;
  uploading: boolean;
  uploadError: string | null;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadProof: () => void;
  onRemoveImage: () => void;
}

export default function UploadProofSection({
  proofUploaded,
  proofPreview,
  uploading,
  uploadError,
  onImageSelect,
  onUploadProof,
  onRemoveImage,
}: UploadProofSectionProps) {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Upload className="w-6 h-6 text-green-600" />
        📸 Upload Bukti Pembayaran
      </h2>

      {proofUploaded ? (
        <div className="bg-green-100 border-2 border-green-300 rounded-xl p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-green-800 mb-2">
            ✅ Bukti Pembayaran Berhasil Diupload!
          </h3>
          <p className="text-green-700 text-sm">
            Admin kami akan segera memverifikasi pembayaran Anda.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">
                📌 Setelah melakukan pembayaran via QRIS:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs ml-2">
                <li>Screenshot bukti pembayaran dari aplikasi e-wallet</li>
                <li>Upload screenshot tersebut di form ini</li>
                <li>Klik tombol "Upload Bukti Pembayaran"</li>
                <li>Tunggu hingga proses upload selesai</li>
              </ol>
            </div>
          </div>

          {/* Upload Area */}
          {!proofPreview ? (
            <div className="border-3 border-dashed border-green-300 rounded-xl p-8 text-center bg-white hover:bg-green-50 transition-colors cursor-pointer">
              <label htmlFor="proof-upload" className="cursor-pointer block">
                <Upload className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-700 font-semibold mb-2">
                  Klik untuk pilih gambar
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  atau drag & drop file di sini
                </p>
                <p className="text-xs text-gray-400">
                  Format: JPG, PNG (Maks. 10MB)
                </p>
                <input
                  id="proof-upload"
                  type="file"
                  accept="image/*"
                  onChange={onImageSelect}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={proofPreview}
                alt="Preview Bukti Pembayaran"
                className="w-full h-64 object-contain rounded-xl bg-gray-100 border-2 border-green-200"
              />
              <button
                onClick={onRemoveImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                disabled={uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm font-medium">{uploadError}</p>
            </div>
          )}

          {/* Upload Button */}
          {proofPreview && !proofUploaded && (
            <button
              onClick={onUploadProof}
              disabled={uploading}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-bold text-lg py-4 rounded-xl hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <Upload className="w-6 h-6" />
                  Upload Bukti Pembayaran
                </>
              )}
            </button>
          )}

          {/* Optional Note */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800 text-center">
              <strong>💡 Opsional:</strong> Jika Anda ingin langsung konfirmasi via WhatsApp atau mengalami kesulitan upload, Anda bisa skip langkah ini dan langsung hubungi admin.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
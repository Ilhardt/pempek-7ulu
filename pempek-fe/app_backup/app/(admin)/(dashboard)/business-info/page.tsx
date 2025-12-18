"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Store, MapPin, Phone, Save, Edit2, X, Image, Loader2 } from 'lucide-react';

interface BusinessInfo {
  business_name?: string;
  address: string;
  contact_1: string;
  contact_2: string;
  qris_image: string | null;
  operating_hours: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function InformasiUsahaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    business_name: 'Pempek 7 Ulu',
    address: '',
    contact_1: '',
    contact_2: '',
    qris_image: null,
    operating_hours: 'Setiap Hari\n09:00 - 20:00 WIB'
  });

  const [editedInfo, setEditedInfo] = useState<BusinessInfo>(businessInfo);
  const [qrPreview, setQrPreview] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }

    loadBusinessInfo();
  }, []);

  const loadBusinessInfo = async () => {
    try {
      setFetching(true);
      const response = await fetch(`${API_URL}/business-info`);
      const result = await response.json();

      if (result.success && result.data) {
        const data = result.data;
        setBusinessInfo(data);
        setEditedInfo(data);
        if (data.qris_image) {
          setQrPreview(data.qris_image);
        }
      }
    } catch (error) {
      console.error('Error loading business info:', error);
      alert('❌ Gagal memuat informasi usaha');
    } finally {
      setFetching(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedInfo(businessInfo);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(businessInfo);
    setQrPreview(businessInfo.qris_image);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('adminToken');
      if (!token) {
        alert('❌ Token tidak ditemukan. Silakan login ulang.');
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/business-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editedInfo)
      });

      const result = await response.json();

      if (result.success) {
        setBusinessInfo(editedInfo);
        setIsEditing(false);
        alert('✅ Informasi usaha berhasil diperbarui!');
      } else {
        alert(`❌ ${result.message || 'Gagal menyimpan informasi usaha'}`);
      }
    } catch (error) {
      console.error('Error saving business info:', error);
      alert('❌ Gagal menyimpan informasi usaha');
    } finally {
      setLoading(false);
    }
  };

  const handleQrCodeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setQrPreview(base64);
        setEditedInfo({ ...editedInfo, qris_image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveQr = () => {
    setQrPreview(null);
    setEditedInfo({ ...editedInfo, qris_image: null });
  };

  if (fetching) {
    return (
      <div className="p-4 sm:p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <span className="ml-3 text-gray-600">Memuat informasi usaha...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <Store className="w-8 h-8 text-orange-500" />
          Informasi Usaha
        </h1>
        <p className="text-gray-600 mt-2">
          Kelola informasi bisnis Anda yang ditampilkan ke customer
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Detail Usaha */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-orange-500">
              Detail Usaha
            </h2>

            {/* Alamat */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <MapPin className="w-4 h-4" />
                Alamat
              </label>
              {isEditing ? (
                <textarea
                  value={editedInfo.address}
                  onChange={(e) => setEditedInfo({ ...editedInfo, address: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  placeholder="Masukkan alamat lengkap"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <p className="text-gray-800">{businessInfo.address}</p>
                </div>
              )}
            </div>

            {/* Kontak */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                Kontak
              </label>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Kontak 1</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedInfo.contact_1}
                      onChange={(e) => setEditedInfo({ ...editedInfo, contact_1: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="+62-XXX-XXXX-XXXX"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <p className="text-gray-800">{businessInfo.contact_1}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Kontak 2</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedInfo.contact_2}
                      onChange={(e) => setEditedInfo({ ...editedInfo, contact_2: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors"
                      placeholder="+62-XXX-XXXX-XXXX"
                    />
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded-lg border-2 border-gray-200">
                      <p className="text-gray-800">{businessInfo.contact_2}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Jam Operasional */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                🕒 Jam Operasional
              </label>
              {isEditing ? (
                <textarea
                  value={editedInfo.operating_hours}
                  onChange={(e) => setEditedInfo({ ...editedInfo, operating_hours: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  placeholder="Setiap Hari&#10;09:00 - 20:00 WIB"
                />
              ) : (
                <div className="px-4 py-3 bg-gray-50 rounded-lg border-2 border-gray-200">
                  <p className="text-gray-800 whitespace-pre-line">{businessInfo.operating_hours}</p>
                </div>
              )}
            </div>
          </div>

          {/* QR Code Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-orange-500">
              QR Code Pembayaran
            </h2>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Image className="w-4 h-4" />
                QRIS
              </label>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
                {qrPreview ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={qrPreview}
                        alt="QR Code"
                        className="w-full max-w-sm mx-auto rounded-lg shadow-md"
                      />
                      {isEditing && (
                        <button
                          onClick={handleRemoveQr}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Image className="w-16 h-16 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500 text-sm">Belum ada QR Code</p>
                  </div>
                )}

                {isEditing && (
                  <div className="mt-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrCodeUpload}
                      className="hidden"
                      id="qr-upload"
                    />
                    <label
                      htmlFor="qr-upload"
                      className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg cursor-pointer text-center transition-colors"
                    >
                      {qrPreview ? 'Ganti QR Code' : 'Upload QR Code'}
                    </label>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Format: JPG, PNG (Max 5MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Tips:</span> Upload QR Code QRIS Anda agar customer dapat melakukan pembayaran dengan mudah melalui aplikasi e-wallet.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-6 border-t-2 border-gray-200 flex justify-end gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <X className="w-5 h-5" />
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Simpan
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-5 h-5" />
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
// app/(admin)/(dashboard)/products/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image?: string;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export default function ProdukPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    image: ''
  });

  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/menu/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch products');
      
      const result = await response.json();
      const data = result.data || result;
      setProducts(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      alert('Gagal memuat data produk');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (mode: 'add' | 'edit', product?: Product) => {
    setModalMode(mode);
    if (mode === 'edit' && product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: product.description || '',
        image: product.image || ''
      });
      setImagePreview(product.image || '');
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        price: '',
        stock: '',
        description: '',
        image: ''
      });
      setImagePreview('');
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setImagePreview('');
    setFormData({
      name: '',
      price: '',
      stock: '',
      description: '',
      image: ''
    });
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, image: url });
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      setImagePreview(url);
    } else {
      setImagePreview('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      alert('Mohon lengkapi Nama, Harga, dan Stok produk');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description || null,
        image: formData.image || null
      };

      const url = modalMode === 'edit' 
        ? `http://localhost:5000/api/menu/${selectedProduct?.id}` 
        : 'http://localhost:5000/api/menu';

      const method = modalMode === 'edit' ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save product');

      alert(modalMode === 'edit' 
        ? '✅ Produk berhasil diupdate!' 
        : '✅ Produk berhasil ditambahkan!'
      );

      handleCloseModal();
      fetchProducts();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert('❌ Gagal menyimpan produk: ' + error.message);
    }
  };

  const handleToggleActive = async (product: Product) => {
    const newStatus = product.is_active === 1 ? 0 : 1;
    const statusText = newStatus === 1 ? 'mengaktifkan' : 'menonaktifkan';
    
    if (!confirm(`Apakah Anda yakin ingin ${statusText} produk "${product.name}"?\n\n${newStatus === 0 ? '⚠️ Produk tidak akan muncul di halaman order customer' : '✅ Produk akan muncul kembali di halaman order customer'}`)) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/menu/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: product.name,
          price: product.price,
          stock: product.stock,
          description: product.description,
          image: product.image,
          is_active: newStatus
        })
      });

      if (!response.ok) throw new Error('Failed to toggle product status');

      alert(`✅ Produk berhasil ${newStatus === 1 ? 'diaktifkan' : 'dinonaktifkan'}!`);
      fetchProducts();
    } catch (error: any) {
      console.error('Error toggling product status:', error);
      alert('❌ Gagal mengubah status produk: ' + error.message);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/menu/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete product');

      alert('✅ Produk berhasil dihapus!');
      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting product:', error);
      alert('❌ Gagal menghapus produk: ' + error.message);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price).replace('IDR', 'Rp');
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="hidden sm:grid grid-cols-12 gap-4 bg-orange-100 px-8 py-4 font-bold text-gray-800">
            <div className="col-span-3">Produk</div>
            <div className="col-span-2 text-center">Harga</div>
            <div className="col-span-2 text-center">Stok</div>
            <div className="col-span-5 text-center">Aksi</div>
          </div>

          <div className="divide-y divide-gray-200">
            {products.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600 text-lg">Belum ada produk</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id}>
                  <div className="sm:hidden p-4 hover:bg-orange-50 transition-colors">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-gray-900 text-base">{product.name}</h3>
                            {product.is_active === 0 && (
                              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                                NONAKTIF
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 font-semibold">{formatPrice(product.price)}/pcs</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Stok</p>
                          <p className="font-bold text-gray-900">{product.stock}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`flex-1 ${
                            product.is_active === 1 
                              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' 
                              : 'bg-green-100 hover:bg-green-200 text-green-800'
                          } px-3 py-2.5 rounded-full text-sm font-semibold transition-colors`}
                        >
                          {product.is_active === 1 ? '🔒 Nonaktifkan' : '✅ Aktifkan'}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal('edit', product)}
                          className="flex-1 bg-orange-200 hover:bg-orange-300 text-gray-800 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:grid grid-cols-12 gap-4 px-8 py-5 hover:bg-orange-50 transition-colors items-center">
                    <div className="col-span-3 flex items-center gap-2">
                      <span className="font-medium text-gray-900">{product.name}</span>
                      {product.is_active === 0 && (
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">
                          NONAKTIF
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-gray-700">{formatPrice(product.price)}/pcs</span>
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-gray-700 font-medium">{product.stock}</span>
                    </div>
                    <div className="col-span-5 flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className={`${
                          product.is_active === 1 
                            ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' 
                            : 'bg-green-100 hover:bg-green-200 text-green-800'
                        } px-4 py-2 rounded-full text-sm font-semibold transition-colors`}
                      >
                        {product.is_active === 1 ? '🔒 Nonaktifkan' : '✅ Aktifkan'}
                      </button>
                      <button
                        onClick={() => handleOpenModal('edit', product)}
                        className="bg-orange-200 hover:bg-orange-300 text-gray-800 px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 px-5 py-2 rounded-full text-sm font-semibold transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => handleOpenModal('add')}
            className="bg-black hover:bg-gray-800 text-white px-8 sm:px-12 py-3 rounded-full text-base font-semibold transition-colors w-full sm:w-auto"
          >
            Tambah Produk
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative my-8">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-600 hover:text-gray-800 z-10"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              {modalMode === 'edit' ? 'Edit Produk' : 'Tambah Produk'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-base text-black"
                  placeholder="Contoh: Pempek Kapal Selam"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 sm:px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-base text-black"
                    placeholder="3000"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-2">
                    Stok
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3 sm:px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-base text-black"
                    placeholder="20"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Deskripsi
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none text-base text-black"
                  rows={3}
                  placeholder="Deskripsi produk..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  URL Gambar
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-base text-black"
                  placeholder="https://i.imgur.com/abc123.png"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Upload gambar ke <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline font-semibold">Imgur</a> lalu paste link-nya di sini
                </p>
                
                {imagePreview && (
                  <div className="mt-3 relative w-full h-40 sm:h-48 border-2 border-gray-300 rounded-xl overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={() => {
                        setImagePreview('');
                        alert('Gagal memuat gambar. Pastikan URL valid dan bisa diakses.');
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setFormData({ ...formData, image: '' });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-2 sm:pt-4">
                <button
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-500 active:bg-orange-600 text-white py-3.5 rounded-full font-bold transition-colors text-base"
                >
                  {modalMode === 'edit' ? 'Update Produk' : 'Simpan Produk'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full bg-orange-200 hover:bg-orange-300 active:bg-orange-400 text-gray-800 py-3.5 rounded-full font-semibold transition-colors text-base"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
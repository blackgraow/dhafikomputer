import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import {
  ChevronRight,
  Monitor,
  ShieldCheck,
  MessageCircle,
  ArrowLeft,
  Info,
  AlertCircle
} from 'lucide-react';

const PublicProductDetailPage = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchProductDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProductDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/public/products/${id}`);
      if (res.data.success) {
        setProduct(res.data.data);
      }
    } catch (err) {
      console.error('Fetch public product detail error:', err);
      setError('Produk tidak ditemukan atau stok unit sudah tidak tersedia.');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  const imagesList = product?.images && product.images.length > 0
    ? product.images
    : [product?.primary_image].filter(Boolean);

  const currentImage = imagesList[activeImageIndex] || product?.primary_image;

  const handleWhatsApp = () => {
    if (!product) return;
    const text = `Halo Dhafi Komputer, saya tertarik dengan unit laptop:\n\n*${product.name}*\nKode: ${product.code}\nKondisi: Laptop ${product.condition_type}\nHarga: ${formatRupiah(product.selling_price)}\n\nApakah unit ini masih tersedia di toko?`;
    window.open(`https://wa.me/6289609033525?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================
          1. NAVBAR (HEADER)
          ======================================================== */}
      <Navbar />

      {/* ========================================================
          2. MAIN PRODUCT DETAIL CONTENT
          ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        
        {/* BREADCRUMB: Beranda / Produk / {Laptop Name} */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/#produk-tersedia" className="hover:text-blue-600 transition-colors">Produk</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold truncate max-w-xs sm:max-w-md">
            {product ? product.name : 'Detail Produk'}
          </span>
        </nav>

        {loading ? (
          /* SKELETON LOADING */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-soft animate-pulse">
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-4/3 bg-slate-100 rounded-xl" />
              <div className="flex gap-2">
                {[1, 2, 3].map(n => <div key={n} className="w-20 h-14 bg-slate-100 rounded-lg" />)}
              </div>
            </div>
            <div className="lg:col-span-6 space-y-5">
              <div className="h-8 bg-slate-100 rounded w-3/4" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="h-5 bg-slate-100 rounded w-1/4" />
              <div className="h-12 bg-slate-100 rounded w-1/2" />
              <div className="h-28 bg-slate-100 rounded" />
            </div>
          </div>
        ) : error || !product ? (
          /* ERROR / NOT FOUND FALLBACK */
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-soft space-y-4 my-8">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900">Produk Tidak Ditemukan</h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Katalog Laptop</span>
            </Link>
          </div>
        ) : (
          /* ========================================================
              PRODUCT DETAIL SPLIT LAYOUT (LEFT 50% / RIGHT 50%)
              ======================================================== */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6 sm:p-10 space-y-12">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              
              {/* ========================================================
                  LEFT: LARGE LAPTOP IMAGE & THUMBNAILS (6 COLS)
                  ======================================================== */}
              <div className="lg:col-span-6 space-y-4">
                
                {/* Large Laptop Image Showcase */}
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center group shadow-soft">
                  {currentImage ? (
                    <img
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-slate-400 flex flex-col items-center p-8 text-center">
                      <Monitor className="w-16 h-16 mb-2 stroke-1 text-slate-300" />
                      <span className="text-xs">Foto Unit Dhafi Komputer</span>
                    </div>
                  )}

                  {/* Condition Badge (BARU / SECOND) */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-lg uppercase tracking-wider ${
                      product.condition_type === 'BARU'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm'
                    }`}>
                      Laptop {product.condition_type}
                    </span>
                  </div>
                </div>

                {/* Optional Thumbnail Images */}
                {imagesList.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-1">
                    {imagesList.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                          activeImageIndex === idx ? 'border-blue-600 scale-102 shadow-sm' : 'border-slate-200 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}

              </div>

              {/* ========================================================
                  RIGHT: PRODUCT HEADERS, PRICE & DESCRIPTION (6 COLS)
                  ======================================================== */}
              <div className="lg:col-span-6 space-y-6">
                
                {/* Title & Brand · Category */}
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {product.name}
                  </h1>

                  <div className="text-sm font-semibold text-slate-500">
                    {product.brand_name} · {product.category_name}
                  </div>

                  {/* Availability Badge */}
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      ● Tersedia
                    </span>
                  </div>
                </div>

                {/* Selling Price */}
                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Harga Jual</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono tracking-tight">
                    {formatRupiah(product.selling_price)}
                  </span>
                </div>

                {/* Short Product Description */}
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-700 uppercase tracking-wider block text-[11px]">
                    Deskripsi Produk
                  </span>
                  <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                    {product.description || `Unit ${product.name} dengan kondisi prima dan performa tangguh untuk mendukung berbagai produktivitas harian, pekerjaan, maupun gaming Anda.`}
                  </p>
                </div>

                {/* CTA Action Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={handleWhatsApp}
                    className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer group"
                  >
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Pesan / Tanya Unit via WhatsApp</span>
                  </button>

                  <Link
                    to="/"
                    className="w-full py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Katalog Laptop</span>
                  </Link>

                  <p className="text-center text-[11px] text-slate-500">
                    * Pembelian langsung di toko Dhafi Komputer Bandung atau reservasi online via WhatsApp resmi.
                  </p>
                </div>

              </div>

            </div>

            {/* ========================================================
                SPECIFICATIONS SECTION
                ======================================================== */}
            <div className="pt-10 border-t border-slate-200 space-y-6">
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  <Info className="w-4 h-4" />
                  <span>SPESIFIKASI</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Spesifikasi Laptop
                </h2>
                <p className="text-xs text-slate-500">
                  Rincian spesifikasi teknis dan kelengkapan unit laptop.
                </p>
              </div>

              {/* Clean Specifications Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
                
                {/* Processor */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Processor</span>
                  <span className="text-sm font-semibold text-slate-900 block">{product.processor || '-'}</span>
                </div>

                {/* RAM */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">RAM</span>
                  <span className="text-sm font-semibold text-slate-900 block">{product.ram || '-'}</span>
                </div>

                {/* Storage */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Storage</span>
                  <span className="text-sm font-semibold text-slate-900 block">{product.storage || '-'}</span>
                </div>

                {/* GPU */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">GPU</span>
                  <span className="text-sm font-semibold text-slate-900 block">{product.gpu || '-'}</span>
                </div>

                {/* Ukuran Layar */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ukuran Layar</span>
                  <span className="text-sm font-semibold text-slate-900 block">{product.screen_size || '-'}</span>
                </div>

                {/* Operating System */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Operating System</span>
                  <span className="text-sm font-semibold text-slate-900 block">{product.operating_system || '-'}</span>
                </div>

                {/* Warna */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Warna</span>
                  <span className="text-sm font-semibold text-slate-900 block">{product.color || '-'}</span>
                </div>

                {/* Tahun Rilis */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tahun Rilis</span>
                  <span className="text-sm font-semibold text-slate-900 block">{product.release_year || '-'}</span>
                </div>

                {/* Garansi */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Garansi</span>
                  <span className="text-sm font-semibold text-slate-900 block">
                    {product.warranty || (product.condition_type === 'BARU' ? 'Garansi Resmi 2 Tahun' : 'Garansi Toko 1 Bulan')}
                  </span>
                </div>

                {/* Kondisi (If Second) */}
                {product.condition_type === 'SECOND' && (
                  <div className="p-4 sm:col-span-2 lg:col-span-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                    <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider block">Kondisi</span>
                    <span className="text-xs font-semibold text-amber-900 block">
                      {product.condition_notes || 'Unit laptop second mulus, hardware normal 100%, siap pakai dan bergaransi toko.'}
                    </span>
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </main>

      {/* ========================================================
          3. FOOTER
          ======================================================== */}
      <Footer />

    </div>
  );
};

export default PublicProductDetailPage;

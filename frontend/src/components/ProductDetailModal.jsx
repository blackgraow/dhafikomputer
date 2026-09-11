import React, { useState } from 'react';
import { getImageUrl } from '../services/api';
import {
  X,
  CheckCircle2,
  Cpu,
  HardDrive,
  Monitor,
  Zap,
  MessageCircle,
  Calendar,
  ShieldCheck,
  Tag,
  Info,
  ChevronRight
} from 'lucide-react';

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  const rawImages = product.images && product.images.length > 0
    ? product.images
    : [product.primary_image].filter(Boolean);

  const imagesList = rawImages.map(img => getImageUrl(img));
  const currentImage = imagesList[activeImageIndex] || getImageUrl(product.primary_image);

  const handleWhatsApp = () => {
    const text = `Halo Dhafi Komputer, saya tertarik dengan unit laptop:\n\n*${product.name}*\nKode: ${product.code}\nKondisi: Laptop ${product.condition_type}\nHarga: ${formatRupiah(product.selling_price)}\n\nApakah unit ini masih tersedia di toko?`;
    window.open(`https://wa.me/6289609033525?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-modal overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        
        {/* Modal Header: Breadcrumb on Left, Only Close 'X' Button on Right */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium truncate pr-4">
            <span>Katalog</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="flex-shrink-0">{product.brand_name}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-slate-900 font-semibold truncate">{product.name}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer flex-shrink-0"
            aria-label="Tutup Detail"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Complete, Rich Product Details */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 max-h-[82vh] overflow-y-auto">
          
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            {/* Main Active Image */}
            <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center group">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                />
              ) : (
                <div className="text-slate-400 flex flex-col items-center p-6 text-center">
                  <Monitor className="w-14 h-14 mb-2 stroke-1 text-slate-300" />
                  <span className="text-xs">Foto Unit Dhafi Komputer</span>
                </div>
              )}

              <div className="absolute top-3 left-3">
                <span className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase tracking-wider ${
                  product.condition_type === 'BARU' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  Laptop {product.condition_type}
                </span>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {imagesList.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {imagesList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all cursor-pointer ${
                      activeImageIndex === idx ? 'border-blue-600' : 'border-slate-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Status & Warranty */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Ketersediaan</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Ready di Toko
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Garansi Unit</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  {product.warranty || (product.condition_type === 'BARU' ? 'Garansi Resmi 2 Tahun' : 'Garansi Toko 1 Bulan')}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Specifications & Actions (7 cols) */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                <span>{product.brand_name}</span>
                <span>•</span>
                <span>{product.category_name}</span>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                {product.name}
              </h2>

              <div className="mt-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-600 font-medium">Harga Jual</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-blue-600 tracking-tight">
                  {formatRupiah(product.selling_price)}
                </span>
              </div>
            </div>

            {/* Full Spec Grid */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600" /> Spesifikasi Laptop
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Processor</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{product.processor || '-'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">RAM</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{product.ram || '-'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Storage</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{product.storage || '-'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">GPU / Kartu Grafis</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{product.gpu || '-'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Ukuran Layar</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{product.screen_size || '-'}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Sistem Operasi</span>
                  <span className="font-semibold text-slate-900 mt-0.5 block">{product.operating_system || '-'}</span>
                </div>
                {product.color && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Warna</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{product.color}</span>
                  </div>
                )}
                {product.release_year && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Tahun Rilis</span>
                    <span className="font-semibold text-slate-900 mt-0.5 block">{product.release_year}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Condition Notes (Second-hand only) */}
            {product.condition_type === 'SECOND' && product.condition_notes && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                <span className="font-bold flex items-center gap-1.5 uppercase text-[10px] tracking-wider text-amber-700">
                  <Tag className="w-3.5 h-3.5" /> Catatan Kondisi Unit Second
                </span>
                <p className="leading-relaxed">{product.condition_notes}</p>
              </div>
            )}

            {/* Description if present */}
            {product.description && (
              <div className="space-y-1 text-xs">
                <span className="font-bold text-slate-600 uppercase tracking-wider block text-[10px]">Keterangan Produk</span>
                <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {product.description}
                </p>
              </div>
            )}

            {/* CTA WhatsApp Button */}
            <div className="pt-2">
              <button
                onClick={handleWhatsApp}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Pesan / Tanya Unit via WhatsApp</span>
              </button>
              <p className="text-center text-[11px] text-slate-500 mt-2">
                Hubungi staf toko Dhafi Komputer untuk cek ketersediaan & reservasi unit.
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

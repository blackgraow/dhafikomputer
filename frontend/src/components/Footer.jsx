import React from 'react';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0B1F3A] border-t border-slate-800 text-slate-300 font-sans">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-12 border-b border-slate-800/80">
          
          {/* Kolom 1: Brand (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-md">
                DK
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-white uppercase block leading-tight">
                  DHAFI KOMPUTER
                </span>
                <span className="text-[11px] text-slate-400 font-medium block leading-tight">
                  Laptop Baru & Second
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Menyediakan berbagai pilihan laptop baru dan second berkualitas untuk kebutuhan kuliah, kerja, bisnis, hingga gaming Anda.
            </p>
          </div>

          {/* Kolom 2: Navigasi (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigasi</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span>Beranda</span></li>
              <li><span>Tentang Kami</span></li>
              <li><span>Produk</span></li>
              <li><span>Kontak</span></li>
            </ul>
          </div>

          {/* Kolom 3: Produk (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Produk</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span>Laptop Baru</span></li>
              <li><span>Laptop Second</span></li>
              <li><span>Semua Produk</span></li>
            </ul>
          </div>

          {/* Kolom 4: Bantuan (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Bantuan</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span>Garansi</span></li>
              <li><span>Cara Pembelian</span></li>
              <li><span>Layanan Support</span></li>
            </ul>
          </div>

          {/* Kolom 5: Kontak Kami (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kontak Kami</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span>0896-0903-3525</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="truncate">dhafikomputer@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>Jl. Purnawarman No.13-15, Bandung 40117</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Dhafi Komputer. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Kebijakan Privasi</span>
            <span>Syarat & Ketentuan</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

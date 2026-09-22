import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductDetailModal from '../components/ProductDetailModal';
import api, { getImageUrl } from '../services/api';
import heroBannerImg from '../assets/dhafi1.jpeg';
import storeInteriorImg from '../assets/dhafi2.jpeg';
import {
  Laptop,
  CheckCircle2,
  ShieldCheck,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Tag,
  Sparkles,
  ArrowRight,
  Headphones,
  DollarSign,
  Package,
  Layers,
  Facebook,
  Instagram,
  Search,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const PublicHomePage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [sortPrice, setSortPrice] = useState('');

  // Carousel ref & drag states
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  useEffect(() => {
    fetchMetadata();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedBrand, selectedCategory, selectedCondition, sortPrice]);

  const fetchMetadata = async () => {
    try {
      const res = await api.get('/public/metadata');
      if (res.data.success) {
        setBrands(res.data.brands || []);
        setCategories(res.data.categories || []);
      }
    } catch (err) {
      console.error('Metadata fetch error:', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedBrand) params.brand_id = selectedBrand;
      if (selectedCategory) params.category_id = selectedCategory;
      if (selectedCondition) params.condition_type = selectedCondition;
      if (sortPrice) params.sort_price = sortPrice;

      const res = await api.get('/public/products', { params });
      if (res.data.success) {
        // Only display products with physical_stock > 0
        const availableItems = (res.data.data || []).filter(item => item.physical_stock > 0);
        setProducts(availableItems);
      }
    } catch (err) {
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Carousel scroll boundary checker
  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      checkScrollButtons();
      el.addEventListener('scroll', checkScrollButtons);
      window.addEventListener('resize', checkScrollButtons);
      return () => {
        el.removeEventListener('scroll', checkScrollButtons);
        window.removeEventListener('resize', checkScrollButtons);
      };
    }
  }, [products]);

  const scrollPrev = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Drag-to-scroll interaction for desktop
  const handleMouseDown = (e) => {
    if (!carouselRef.current) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeftState(carouselRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 1.3;
    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }
    carouselRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('');
    setSelectedCategory('');
    setSelectedCondition('');
    setSortPrice('');
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // High quality realistic image fallback based on laptop model & brand
  const getLaptopImage = (laptop) => {
    if (laptop.primary_image) {
      return getImageUrl(laptop.primary_image);
    }
    const brand = (laptop.brand_name || '').toLowerCase();
    const category = (laptop.category_name || '').toLowerCase();
    const name = (laptop.name || '').toLowerCase();

    if (brand.includes('asus') || name.includes('rog') || category.includes('gaming')) {
      return 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=700&auto=format&fit=crop&q=80';
    }
    if (brand.includes('lenovo') || name.includes('thinkpad')) {
      return 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=700&auto=format&fit=crop&q=80';
    }
    if (brand.includes('apple') || name.includes('macbook')) {
      return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&auto=format&fit=crop&q=80';
    }
    if (brand.includes('acer') || name.includes('swift') || name.includes('nitro') || name.includes('predator')) {
      return 'https://images.unsplash.com/photo-1544731612-de2f96407ad9?w=700&auto=format&fit=crop&q=80';
    }
    if (brand.includes('hp') || name.includes('victus') || name.includes('omen') || name.includes('elitebook')) {
      return 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=700&auto=format&fit=crop&q=80';
    }
    if (brand.includes('dell') || name.includes('xps') || name.includes('inspiron')) {
      return 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=700&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&auto=format&fit=crop&q=80';
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================
          1. NAVBAR
          ======================================================== */}
      <Navbar />

      {/* ========================================================
          2. HERO SECTION (SPLIT 2 COLUMNS)
          ======================================================== */}
      <section id="beranda" className="relative bg-white border-b border-slate-200/80 overflow-hidden pt-8 pb-16 lg:py-20">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Hero Copy & CTA */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Heading Besar */}
              <h1 className="text-4xl sm:text-5xl lg:text-[50px] font-extrabold text-[#0B1F3A] tracking-tight leading-[1.15]">
                Laptop Terbaik<br />
                <span className="text-blue-600">Untuk Setiap Kebutuhan</span>
              </h1>

              {/* Subheading */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Temukan berbagai pilihan laptop baru dan second untuk kebutuhan kuliah, kerja, bisnis, gaming, dan penggunaan sehari-hari.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/products"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 cursor-pointer group"
                >
                  <span>Lihat Produk</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => scrollToSection('tentang')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 transition-colors cursor-pointer"
                >
                  Tentang Kami
                </button>
              </div>

              {/* 4 Selling Points (Grid with blue outline icons) */}
              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Package className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block mt-1">Produk Berkualitas</span>
                  <span className="text-[10px] text-slate-500 block">Teruji & Terjamin</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <DollarSign className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block mt-1">Harga Kompetitif</span>
                  <span className="text-[10px] text-slate-500 block">Terjangkau</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block mt-1">Garansi Resmi</span>
                  <span className="text-[10px] text-slate-500 block">Aman & Terpercaya</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                    <Headphones className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 block mt-1">Layanan Support</span>
                  <span className="text-[10px] text-slate-500 block">Siap Membantu</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Image Showcase */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-3 shadow-card group">
                <img
                  src={heroBannerImg}
                  alt="Toko Dhafi Komputer Modern Store"
                  className="w-full h-72 sm:h-96 object-cover rounded-xl group-hover:scale-102 transition-transform duration-300"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          3. TENTANG KAMI (SPLIT 2 COLUMNS)
          ======================================================== */}
      <section id="tentang" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Foto Interior Toko Modern */}
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white p-3 shadow-card group">
                <img
                  src={storeInteriorImg}
                  alt="Toko Dhafi Komputer Modern Store"
                  className="w-full h-72 sm:h-96 object-cover rounded-xl group-hover:scale-102 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Right: Copywriting & Stats */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
                  Tentang Dhafi Komputer
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Dhafi Komputer adalah toko laptop yang menyediakan berbagai pilihan laptop baru maupun second berkualitas dari sumber terpercaya. Kami berkomitmen memberikan produk terbaik dengan harga bersaing dan pelayanan yang memuaskan.
              </p>

              {/* 3 Stats Badges */}
              <div className="grid grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-soft text-center space-y-1">
                  <strong className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono block">100+</strong>
                  <span className="text-xs font-medium text-slate-600 block">Laptop Tersedia</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-soft text-center space-y-1">
                  <strong className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono block">2+</strong>
                  <span className="text-xs font-medium text-slate-600 block">Tahun Pengalaman</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-soft text-center space-y-1">
                  <strong className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono block">100%</strong>
                  <span className="text-xs font-medium text-slate-600 block">Kepuasan Pelanggan</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
                >
                  <span>Lihat Produk</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          4. JENIS LAPTOP (TWO LARGE CARDS SIDE-BY-SIDE)
          ======================================================== */}
      <section id="jenis-laptop" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              Jenis Laptop
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Pilihan kategori laptop yang tersedia di Dhafi Komputer sesuai kebutuhan Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Card 1 — Laptop Baru */}
            <div className="relative rounded-2xl bg-linear-to-br from-[#0B1F3A] to-slate-900 border border-slate-800 p-8 text-white flex flex-col justify-between space-y-6 shadow-xl group overflow-hidden">
              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-bold text-white tracking-tight">Laptop Baru</h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                  Pilihan laptop baru berkualitas dari Master Dealer dengan garansi resmi dan performa optimal.
                </p>
              </div>

              <div className="relative z-10 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700/60 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80"
                  alt="Laptop Baru Dhafi Komputer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>

              <div className="relative z-10 pt-2">
                <Link
                  to="/products?condition=BARU"
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0B1F3A] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Lihat Produk</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Card 2 — Laptop Second */}
            <div className="relative rounded-2xl bg-linear-to-br from-[#0B1F3A] to-slate-900 border border-slate-800 p-8 text-white flex flex-col justify-between space-y-6 shadow-xl group overflow-hidden">
              <div className="space-y-3 relative z-10">
                <h3 className="text-2xl font-bold text-white tracking-tight">Laptop Second</h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-md">
                  Pilihan laptop second berkualitas dari Dealer atau Pemilik/Customer dengan kondisi yang terjamin.
                </p>
              </div>

              <div className="relative z-10 aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700/60 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&auto=format&fit=crop&q=80"
                  alt="Laptop Second Dhafi Komputer"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>

              <div className="relative z-10 pt-2">
                <Link
                  to="/products?condition=SECOND"
                  className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#0B1F3A] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <span>Lihat Produk</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          5. PRODUK TERSEDIA (HORIZONTAL CAROUSEL SLIDER)
          ======================================================== */}
      <section id="produk" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Section Header with Left Title & Right Actions (Lihat Semua Produk Link) + Carousel Arrows */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight mt-1">
                Laptop Tersedia
              </h2>
              <p className="text-sm text-slate-600 mt-1">
                Temukan laptop terbaik yang tersedia di Dhafi Komputer.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              {/* Actual Navigation to Katalog Laptop Page */}
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-all mr-1 cursor-pointer group py-2"
              >
                <span>Lihat Semua Produk</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* HORIZONTAL PRODUCT CAROUSEL */}
          {loading ? (
            <div className="flex items-stretch gap-4 sm:gap-5 overflow-hidden py-2">
              {[1, 2, 3, 4].map(n => (
                <div
                  key={n}
                  className="flex-none w-66.25 rounded-2xl bg-white border border-slate-200 p-4 space-y-4 animate-pulse"
                >
                  <div className="aspect-4/3 bg-slate-100 rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-100 rounded w-3/4" />
                    <div className="h-3 bg-slate-100 rounded w-1/2" />
                  </div>
                  <div className="h-5 bg-slate-100 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200 space-y-3 shadow-soft">
              <Laptop className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Tidak ada produk yang sesuai</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Coba ubah kata kunci pencarian atau filter brand/kategori untuk melihat unit laptop yang tersedia.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-semibold text-xs hover:bg-blue-100 transition-colors"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div
              ref={carouselRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUpOrLeave}
              onMouseLeave={handleMouseUpOrLeave}
              className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto flex-nowrap py-3 px-1 scroll-smooth select-none cursor-grab [-ms-overflow-style:none] scrollbar-none"
              style={{
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {products.map((laptop) => (
                <div
                  key={laptop.id}
                  className="flex-none w-[78vw] sm:w-61.25 md:w-63.75 lg:w-66.25 rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-soft hover:shadow-card-hover hover:border-slate-300 transition-all flex flex-col justify-between group"
                >
                  {/* Card Image */}
                  <div className="relative aspect-4/3 bg-white overflow-hidden border-b border-slate-100 flex items-center justify-center p-3">
                    <img
                      src={getLaptopImage(laptop)}
                      alt={laptop.name}
                      className="w-full h-full object-cover rounded-xl group-hover:scale-103 transition-transform duration-200 pointer-events-none"
                    />

                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                        laptop.condition_type === 'BARU'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {laptop.condition_type}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {laptop.category_name}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Brand */}
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        {laptop.brand_name}
                      </span>

                      {/* Laptop Name */}
                      <h3 className="text-sm font-bold text-[#0B1F3A] mt-0.5 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {laptop.name}
                      </h3>

                      {/* Key Specs */}
                      <div className="mt-2 space-y-0.5 text-[11px] text-slate-600">
                        <div className="truncate font-medium text-slate-700">
                          {laptop.processor || '-'}
                        </div>
                        <div className="truncate text-slate-500">
                          {laptop.ram || '-'} · {laptop.storage || '-'}
                        </div>
                        {laptop.gpu && (
                          <div className="truncate text-slate-500">
                            {laptop.gpu}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price, Availability Badge & Action */}
                    <div className="pt-3 border-t border-slate-100 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-base font-extrabold text-[#0B1F3A] font-mono tracking-tight">
                          {formatRupiah(laptop.selling_price)}
                        </span>
                        
                        {/* Status Tersedia: Green Dot */}
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          ● Tersedia
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          if (!hasDragged) {
                            setSelectedProduct(laptop);
                          }
                        }}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>Lihat Detail</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ========================================================
          6. KEUNGGULAN DHAFI KOMPUTER (4 FEATURES IN ONE ROW)
          ======================================================== */}
      <section id="keunggulan" className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              Mengapa Memilih Dhafi Komputer?
            </h2>
            <p className="text-sm text-slate-600">
              Pelayanan profesional dan jaminan mutu untuk setiap produk laptop kami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Produk Berkualitas</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Laptop berkualitas dengan kondisi terbaik dan terjamin.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Harga Terbaik</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Harga bersaing dan terjangkau untuk semua kalangan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Garansi Resmi</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap pembelian dilengkapi dengan garansi resmi.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Headphones className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Layanan Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Layanan pelanggan yang ramah dan siap membantu Anda.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          7. INFORMASI TOKO (SPLIT 2 COLUMNS + MAPS PLACEHOLDER)
          ======================================================== */}
      <section id="kontak" className="py-16 sm:py-20 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
              Informasi Dhafi Komputer
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Contact Details */}
            <div className="lg:col-span-6 rounded-2xl bg-white border border-slate-200 p-8 shadow-card space-y-6">
              
              <div className="space-y-4">
                
                {/* Alamat (Clickable to Google Maps) */}
                <a
                  href="https://maps.app.goo.gl/vPcPGtxpRkeB8PL36"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3.5 group cursor-pointer"
                  title="Buka lokasi di Google Maps"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Alamat</span>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition-colors mt-0.5">
                      Bandung Electronics Center, Bandung BEC, Blk. F No.17a Lt.1, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40117
                    </p>
                  </div>
                </a>

                {/* Jam Operasional */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Jam Operasional</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      Senin - Minggu: 10.00 - 21.00 WIB
                    </p>
                  </div>
                </div>

                {/* Kontak */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Kontak</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      0896-0903-3525
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Email</span>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">
                      dhafikomputer@gmail.com
                    </p>
                  </div>
                </div>

              </div>

              {/* Follow Kami */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Follow Kami</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://wa.me/6289609033525"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 text-xs font-semibold border border-slate-200 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Right: Interactive Google Maps Store Location Card (Fully Clickable) */}
            <a
              href="https://maps.app.goo.gl/vPcPGtxpRkeB8PL36"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:col-span-6 rounded-2xl bg-white border border-slate-200 p-3 shadow-card hover:shadow-card-hover hover:border-blue-300 transition-all block group cursor-pointer"
              title="Klik untuk membuka lokasi Dhafi Komputer di Google Maps"
            >
              <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200">
                {/* Map Grid Pattern Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-size-[24px_24px] opacity-60" />

                {/* Decorative Roads / Rivers */}
                <svg className="absolute inset-0 w-full h-full text-slate-200/80 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,50 Q150,120 300,80 T600,200" fill="none" stroke="currentColor" strokeWidth="8" />
                  <path d="M100,0 Q200,180 400,250 T600,350" fill="none" stroke="currentColor" strokeWidth="12" />
                  <path d="M0,280 Q250,200 500,290" fill="none" stroke="#bae6fd" strokeWidth="10" />
                </svg>

                {/* Location Marker Pin with Pulse & Tooltip */}
                <div className="relative z-10 flex flex-col items-center group-hover:scale-105 transition-transform duration-300">
                  <div className="p-3.5 bg-blue-600 group-hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/40 border-2 border-white transition-colors">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="mt-2 px-3.5 py-1.5 bg-white rounded-lg shadow-md border border-slate-200 text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                    <span>Dhafi Komputer Store</span>
                  </div>
                </div>

                {/* Peta Lokasi Toko Interactive Action Button */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 group-hover:text-blue-600 group-hover:bg-blue-50 border border-slate-200 group-hover:border-blue-200 shadow-sm flex items-center gap-1.5 transition-all">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Peta Lokasi Toko ↗</span>
                </div>
              </div>
            </a>

          </div>
        </div>
      </section>

      {/* ========================================================
          8. FOOTER (DARK NAVY #0B1F3A)
          ======================================================== */}
      <Footer />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
};

export default PublicHomePage;

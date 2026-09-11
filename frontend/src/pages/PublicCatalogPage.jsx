import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductDetailModal from '../components/ProductDetailModal';
import api from '../services/api';
import api, { getImageUrl } from '../services/api';
import {
  Laptop,
  Search,
  RefreshCw,
  ArrowRight,
  ChevronRight,
  Filter,
  Monitor,
  CheckCircle2,
  Home
} from 'lucide-react';

const PublicCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Filter state initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || '');
  const [sortPrice, setSortPrice] = useState(searchParams.get('sort') || '');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchMetadata();
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
      console.error('Catalog fetch error:', err);
    } finally {
      setLoading(false);
    }
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
    setSearchParams({});
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  // High quality curated stock photos for fallback
  const getLaptopImage = (laptop) => {
    if (laptop.primary_image && laptop.primary_image.startsWith('http')) {
      return laptop.primary_image;
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
      
      {/* 1. NAVBAR */}
      <Navbar />

      {/* 2. BREADCRUMB & PAGE HEADER */}
      <div className="bg-white border-b border-slate-200/80 pt-8 pb-10">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          
          {/* Breadcrumb: Beranda / Laptop */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link
              to="/"
              className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Beranda</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-900 font-semibold">Laptop</span>
          </nav>

          {/* Title & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-1">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] tracking-tight">
                Laptop Tersedia
              </h1>
              <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-2xl">
                Temukan berbagai pilihan laptop baru dan second yang tersedia di Dhafi Komputer.
              </p>
            </div>

            
          </div>

        </div>
      </div>

      {/* 3. MAIN CATALOG AREA */}
      <main className="flex-1 py-10">
        <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Search & Filter Toolbar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-soft space-y-3">
            <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row gap-3">
              
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari nama laptop, processor, brand..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none transition-colors"
                />
              </div>

              {/* Brand filter */}
              <div className="w-full lg:w-44">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none"
                >
                  <option value="">Semua Brand</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Category filter */}
              <div className="w-full lg:w-44">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Condition filter */}
              <div className="w-full lg:w-36">
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none"
                >
                  <option value="">Semua Kondisi</option>
                  <option value="BARU">Laptop Baru</option>
                  <option value="SECOND">Laptop Second</option>
                </select>
              </div>

              {/* Price Sort filter */}
              <div className="w-full lg:w-40">
                <select
                  value={sortPrice}
                  onChange={(e) => setSortPrice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none"
                >
                  <option value="">Urutkan Harga</option>
                  <option value="asc">Harga: Rendah ke Tinggi</option>
                  <option value="desc">Harga: Tinggi ke Rendah</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
                >
                  Cari
                </button>
                {(search || selectedBrand || selectedCategory || selectedCondition || sortPrice) && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors cursor-pointer"
                    title="Reset Semua Filter"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* PRODUCT MULTI-ROW GRID */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="rounded-2xl bg-white border border-slate-200 p-4 space-y-4 animate-pulse">
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
            <div className="p-16 text-center rounded-2xl bg-white border border-slate-200 space-y-4 shadow-soft">
              <Laptop className="w-14 h-14 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">Tidak ada produk yang sesuai</h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  Coba ubah kata kunci pencarian atau reset filter brand/kategori untuk melihat unit laptop yang tersedia.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((laptop) => (
                <div
                  key={laptop.id}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-soft hover:shadow-card-hover hover:border-slate-300 transition-all flex flex-col justify-between group"
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
                        onClick={() => setSelectedProduct(laptop)}
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
      </main>

      {/* 4. FOOTER */}
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

export default PublicCatalogPage;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Plus,
  Search,
  Filter,
  SlidersHorizontal,
  Edit,
  Trash2,
  Eye,
  X,
  CheckCircle2,
  AlertCircle,
  Laptop as LaptopIcon,
  Sparkles,
  Tag,
  Boxes,
  Layers,
  Building2,
  Store,
  User,
  ShieldCheck,
  Cpu,
  HardDrive,
  Monitor,
  Calendar,
  DollarSign,
  PackageCheck,
  FileText,
  History,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowUpDown,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  Zap,
  BarChart3,
  Shield,
  Clock,
  ExternalLink,
  Package
} from 'lucide-react';

const AdminLaptopsPage = () => {
  const navigate = useNavigate();
  const [laptops, setLaptops] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterDealers, setMasterDealers] = useState([]);
  const [dealers, setDealers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, total_pages: 1, total_items: 0, limit: 10 });

  // Summary Statistics State
  const [summaryStats, setSummaryStats] = useState({
    total_laptop: 6,
    laptop_baru: 6,
    laptop_second: 0,
    estimasi_nilai_stok: 407983000
  });

  // Filter & Search & Sort State
  const [search, setSearch] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Popover States
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLaptop, setEditingLaptop] = useState(null);
  const [viewingLaptop, setViewingLaptop] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [detailTab, setDetailTab] = useState('SPECS'); // 'SPECS', 'FINANCE', 'HISTORY'
  const [deleteConfirmLaptop, setDeleteConfirmLaptop] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Toast Feedback State
  const [toast, setToast] = useState(null);

  // Form Fields State
  const initialForm = {
    code: '',
    name: '',
    brand_id: '',
    category_id: '',
    condition_type: 'BARU',
    source_type: 'MASTER_DEALER',
    master_dealer_id: '',
    dealer_id: '',
    customer_name: '',
    customer_contact: '',
    customer_notes: '',
    processor: '',
    ram: '',
    storage: '',
    gpu: '',
    screen_size: '14"',
    operating_system: 'Windows 11 Home',
    color: '',
    release_year: '2024',
    warranty: '',
    serial_number: '',
    condition_notes: '',
    purchase_price: 0,
    selling_price: 0,
    display_stock: 0,
    physical_stock: 1,
    status: 'TERSEDIA',
    description: '',
    primary_image: ''
  };

  const [formData, setFormData] = useState(initialForm);

  // Refs for closing click-outside
  const filterRef = useRef(null);
  const sortRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchMetadata();
    fetchSummaryStats();
  }, []);

  useEffect(() => {
    fetchLaptops();
  }, [currentPage, search, filterBrand, filterCategory, filterCondition, filterStatus, sortBy]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilterPanel(false);
      }
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setShowSortDropdown(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSummaryStats = async () => {
    try {
      const res = await api.get('/dashboard/summary');
      if (res.data.success && res.data.data?.cards) {
        setSummaryStats(res.data.data.cards);
      }
    } catch (err) {
      console.error('Summary stats fetch error:', err);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [resB, resC, resMD, resD] = await Promise.all([
        api.get('/brands'),
        api.get('/categories'),
        api.get('/master-dealers'),
        api.get('/dealers')
      ]);
      if (resB.data.success) setBrands(resB.data.data);
      if (resC.data.success) setCategories(resC.data.data);
      if (resMD.data.success) setMasterDealers(resMD.data.data);
      if (resD.data.success) setDealers(resD.data.data);
    } catch (err) {
      console.error('Metadata fetch error:', err);
    }
  };

  const fetchLaptops = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10
      };
      if (search.trim()) params.search = search.trim();
      if (filterBrand) params.brand_id = filterBrand;
      if (filterCategory) params.category_id = filterCategory;
      if (filterCondition) params.condition_type = filterCondition;
      if (filterStatus) params.status = filterStatus;

      if (sortBy === 'price_asc') params.sort_price = 'asc';
      if (sortBy === 'price_desc') params.sort_price = 'desc';

      const res = await api.get('/laptops', { params });
      if (res.data.success) {
        let items = res.data.data || [];

        if (sortBy === 'name_asc') {
          items = [...items].sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === 'name_desc') {
          items = [...items].sort((a, b) => b.name.localeCompare(a.name));
        } else if (sortBy === 'stock_desc') {
          items = [...items].sort((a, b) => (b.physical_stock || 0) - (a.physical_stock || 0));
        } else if (sortBy === 'stock_asc') {
          items = [...items].sort((a, b) => (a.physical_stock || 0) - (b.physical_stock || 0));
        }

        setLaptops(items);
        if (res.data.pagination) {
          setPagination({
            current_page: res.data.pagination.current_page || 1,
            total_pages: res.data.pagination.total_pages || 1,
            total_items: res.data.pagination.total_items ?? items.length,
            limit: res.data.pagination.limit || res.data.pagination.per_page || 10
          });
        }
      }
    } catch (err) {
      console.error('Laptops fetch error:', err);
      showToast('Gagal memuat data laptop', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    navigate('/admin/laptops/create');
  };

  const handleOpenEditModal = (laptop) => {
    setEditingLaptop(laptop);
    setFormData({
      code: laptop.code || '',
      name: laptop.name || '',
      brand_id: laptop.brand_id || '',
      category_id: laptop.category_id || '',
      condition_type: laptop.condition_type || 'BARU',
      source_type: laptop.source_type || 'MASTER_DEALER',
      master_dealer_id: laptop.master_dealer_id || '',
      dealer_id: laptop.dealer_id || '',
      customer_name: laptop.customer_name || '',
      customer_contact: laptop.customer_contact || '',
      customer_notes: laptop.customer_notes || '',
      processor: laptop.processor || '',
      ram: laptop.ram || '',
      storage: laptop.storage || '',
      gpu: laptop.gpu || '',
      screen_size: laptop.screen_size || '14"',
      operating_system: laptop.operating_system || 'Windows 11 Home',
      color: laptop.color || '',
      release_year: laptop.release_year || '2024',
      warranty: laptop.warranty || '',
      serial_number: laptop.serial_number || '',
      condition_notes: laptop.condition_notes || '',
      purchase_price: laptop.purchase_price || 0,
      selling_price: laptop.selling_price || 0,
      display_stock: laptop.display_stock || 0,
      physical_stock: laptop.physical_stock || 0,
      status: laptop.status || 'TERSEDIA',
      description: laptop.description || '',
      primary_image: laptop.primary_image || ''
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleOpenDetailModal = (laptop) => {
    setActiveMenuId(null);
    navigate(`/admin/laptops/${laptop.id}`);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = { ...formData };
      payload.purchase_price = parseFloat(payload.purchase_price) || 0;
      payload.selling_price = parseFloat(payload.selling_price) || 0;
      payload.display_stock = parseInt(payload.display_stock, 10) || 0;
      payload.physical_stock = parseInt(payload.physical_stock, 10) || 0;
      payload.brand_id = parseInt(payload.brand_id, 10) || null;
      payload.category_id = parseInt(payload.category_id, 10) || null;

      if (payload.condition_type === 'BARU') {
        payload.source_type = 'MASTER_DEALER';
        payload.master_dealer_id = payload.master_dealer_id ? parseInt(payload.master_dealer_id, 10) : null;
        payload.dealer_id = null;
        payload.customer_name = null;
        payload.customer_contact = null;
        payload.customer_notes = null;
      } else {
        if (payload.source_type === 'DEALER') {
          payload.dealer_id = payload.dealer_id ? parseInt(payload.dealer_id, 10) : null;
          payload.master_dealer_id = null;
          payload.customer_name = null;
          payload.customer_contact = null;
          payload.customer_notes = null;
        } else if (payload.source_type === 'PEMILIK') {
          payload.master_dealer_id = null;
          payload.dealer_id = null;
        }
      }

      if (editingLaptop) {
        const res = await api.put(`/laptops/${editingLaptop.id}`, payload);
        if (res.data.success) {
          showToast('Data laptop berhasil diperbarui!');
          setIsModalOpen(false);
          fetchLaptops();
          fetchSummaryStats();
        }
      } else {
        const res = await api.post('/laptops', payload);
        if (res.data.success) {
          showToast('Laptop baru berhasil ditambahkan ke inventaris!');
          setIsModalOpen(false);
          fetchLaptops();
          fetchSummaryStats();
        }
      }
    } catch (err) {
      console.error('Save laptop error:', err);
      showToast(err.response?.data?.message || 'Gagal menyimpan data laptop', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmLaptop) return;
    try {
      const res = await api.delete(`/laptops/${deleteConfirmLaptop.id}`);
      if (res.data.success) {
        showToast('Data laptop berhasil dihapus!');
        setDeleteConfirmLaptop(null);
        fetchLaptops();
        fetchSummaryStats();
      }
    } catch (err) {
      console.error('Delete laptop error:', err);
      showToast(err.response?.data?.message || 'Gagal menghapus data laptop', 'error');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setFilterBrand('');
    setFilterCategory('');
    setFilterCondition('');
    setFilterStatus('');
    setSortBy('latest');
    setCurrentPage(1);
    setShowFilterPanel(false);
    setShowSortDropdown(false);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  const isFilterActive = filterBrand || filterCategory || filterCondition || filterStatus;
  const isSearchActive = search.trim().length > 0;

  const sortLabels = {
    latest: 'Terbaru',
    name_asc: 'Nama A–Z',
    name_desc: 'Nama Z–A',
    price_asc: 'Harga Terendah',
    price_desc: 'Harga Tertinggi',
    stock_desc: 'Stok Terbanyak',
    stock_asc: 'Stok Tersedikit'
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-150 ${
          toast.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ========================================================
          1. PAGE HEADER WITH MODERN DECORATIVE VISUAL
          ======================================================== */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left: Badge, Big Title, Subtitle */}
          <div className="space-y-2 max-w-xl">
            {/* Big Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Data Laptop
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Kelola data inventaris laptop Dhafi Komputer dengan mudah dan efisien.
            </p>
          </div>

          {/* Right: Modern Laptop Illustration & Primary Button */}
          <div className="flex items-center gap-4 sm:gap-6 self-start md:self-center">
            {/* + Tambah Laptop Button */}
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs shadow-md shadow-blue-600/25 hover:shadow-blue-600/40 transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Laptop</span>
            </button>
          </div>

        </div>
      

      {/* ========================================================
          2. SEARCH & FILTER TOOLBAR
          ======================================================== */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Left: Search Box */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari kode atau nama laptop..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 shadow-xs transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filter, Urutkan, View Mode, Reset */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          
          {/* [ Filter ] Button & Popover */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => {
                setShowFilterPanel(!showFilterPanel);
                setShowSortDropdown(false);
              }}
              className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                isFilterActive
                  ? 'bg-blue-50 text-blue-600 border-blue-200 ring-1 ring-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
              {isFilterActive && (
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>

            {/* Filter Popover Panel */}
            {showFilterPanel && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 z-40 space-y-3.5 animate-in fade-in zoom-in-95 duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-900">Filter Inventaris</span>
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] text-blue-600 hover:underline font-medium"
                  >
                    Reset
                  </button>
                </div>

                {/* Filter Merek */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-600">Merek</label>
                  <select
                    value={filterBrand}
                    onChange={(e) => { setFilterBrand(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="">Semua Merek</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                {/* Filter Kategori */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-600">Kategori</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => { setFilterCategory(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Filter Jenis Barang */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-600">Jenis Barang</label>
                  <select
                    value={filterCondition}
                    onChange={(e) => { setFilterCondition(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="">Semua</option>
                    <option value="BARU">Baru</option>
                    <option value="SECOND">Second</option>
                  </select>
                </div>

                {/* Filter Status */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-slate-600">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="">Semua</option>
                    <option value="TERSEDIA">Tersedia</option>
                    <option value="HABIS">Habis</option>
                    <option value="DISPLAY">Display</option>
                    <option value="TERJUAL">Terjual</option>
                    <option value="TIDAK_AKTIF">Tidak Aktif</option>
                  </select>
                </div>

                <button
                  onClick={() => setShowFilterPanel(false)}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  Terapkan Filter
                </button>
              </div>
            )}
          </div>

          {/* [ Urutkan / Terbaru ] Dropdown */}
          <div className="relative" ref={sortRef}>
            <button
              onClick={() => {
                setShowSortDropdown(!showSortDropdown);
                setShowFilterPanel(false);
              }}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span>{sortLabels[sortBy] || 'Terbaru'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-xl py-1.5 z-40 text-xs animate-in fade-in zoom-in-95 duration-100">
                <span className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Opsi Pengurutan
                </span>
                {Object.entries(sortLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSortBy(key);
                      setShowSortDropdown(false);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer ${
                      sortBy === key ? 'font-bold text-blue-600 bg-blue-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{label}</span>
                    {sortBy === key && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* [ Table / Grid View Toggle ] */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Tabel"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Tampilan Grid Card"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* [ Reset ] Button */}
          {(isFilterActive || isSearchActive || sortBy !== 'latest') && (
            <button
              onClick={handleResetFilters}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors cursor-pointer"
              title="Reset Semua Filter & Pencarian"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}

        </div>
      </div>
      {/* ========================================================
          4. SECTION DAFTAR LAPTOP (MAIN CARD & TABLE/GRID)
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        
        {/* Card Header: Title & Subtitle + Top Pagination */}
        <div className="p-5 sm:px-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">Daftar Laptop</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola dan pantau seluruh data laptop yang tersedia di sistem.
            </p>
          </div>
        </div>

        {/* ========================================================
            VIEW MODE: TABLE VIEW
            ======================================================== */}
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              
              {/* Table Header */}
              <thead className="bg-slate-50/90 text-slate-700 font-bold text-xs border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4">Kode</th>
                  <th className="py-3.5 px-4">Nama Laptop</th>
                  <th className="py-3.5 px-3">Merek</th>
                  <th className="py-3.5 px-3">Kategori</th>
                  <th className="py-3.5 px-3">Jenis</th>
                  <th className="py-3.5 px-3">Sumber</th>
                  <th className="py-3.5 px-4 text-right">Harga Jual</th>
                  <th className="py-3.5 px-3 text-center">Display</th>
                  <th className="py-3.5 px-3 text-center">Stok Fisik</th>
                  <th className="py-3.5 px-3.5 text-center">Status</th>
                  <th className="py-3.5 px-3 text-center">Action</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  /* SKELETON LOADING ROWS */
                  [1, 2, 3, 4, 5, 6].map((n) => (
                    <tr key={n} className="animate-pulse">
                      <td className="py-3.5 px-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
                      <td className="py-3.5 px-4"><div className="h-4 bg-slate-100 rounded w-48" /></td>
                      <td className="py-3.5 px-3"><div className="h-4 bg-slate-100 rounded w-16" /></td>
                      <td className="py-3.5 px-3"><div className="h-4 bg-slate-100 rounded w-24" /></td>
                      <td className="py-3.5 px-3"><div className="h-5 bg-slate-100 rounded-full w-14" /></td>
                      <td className="py-3.5 px-3"><div className="h-4 bg-slate-100 rounded w-28" /></td>
                      <td className="py-3.5 px-4 text-right"><div className="h-4 bg-slate-100 rounded w-24 ml-auto" /></td>
                      <td className="py-3.5 px-3 text-center"><div className="h-4 bg-slate-100 rounded w-8 mx-auto" /></td>
                      <td className="py-3.5 px-3 text-center"><div className="h-4 bg-slate-100 rounded w-6 mx-auto" /></td>
                      <td className="py-3.5 px-3.5 text-center"><div className="h-5 bg-slate-100 rounded-full w-20 mx-auto" /></td>
                      <td className="py-3.5 px-3 text-center"><div className="h-6 bg-slate-100 rounded w-6 mx-auto" /></td>
                    </tr>
                  ))
                ) : laptops.length === 0 ? (
                  /* EMPTY STATE - MATCHING MASTER MEREK STYLE */
                  <tr>
                    <td colSpan="11" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <LaptopIcon className="w-8 h-8 text-slate-300 stroke-1" />
                        <p className="font-medium text-slate-600">Tidak ada data ditemukan</p>
                        <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau filter yang dipilih.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  /* DATA ROWS */
                  laptops.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      
                      {/* 1. Kode */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {row.code}
                      </td>

                      {/* 2. Nama Laptop */}
                      <td className="py-3.5 px-4">
                        <div>
                          <Link
                            to={`/admin/laptops/${row.id}`}
                            className="font-semibold text-slate-900 block hover:text-blue-600 transition-colors"
                          >
                            {row.name}
                          </Link>
                          {row.processor && (
                            <span className="text-[10px] text-slate-400 block truncate max-w-xs font-mono">
                              {row.processor}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Merek */}
                      <td className="py-3.5 px-3 text-slate-700 font-medium whitespace-nowrap">
                        {row.brand_name}
                      </td>

                      {/* 4. Kategori */}
                      <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                        {row.category_name}
                      </td>

                      {/* 5. Jenis (Pill Badge) */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.condition_type === 'BARU'
                            ? 'bg-blue-50 text-blue-600 border border-blue-200/80'
                            : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                        }`}>
                          {row.condition_type === 'BARU' ? 'Baru' : 'Second'}
                        </span>
                      </td>

                      {/* 6. Sumber */}
                      <td className="py-3.5 px-3 text-slate-700 whitespace-nowrap text-[11px]">
                        {row.condition_type === 'BARU'
                          ? (row.master_dealer_name || 'MD 1 (Master Dealer Utama)')
                          : (row.dealer_name || row.customer_name || 'Pemilik/Customer')}
                      </td>

                      {/* 7. Harga Jual */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {formatRupiah(row.selling_price)}
                      </td>

                      {/* 8. Display */}
                      <td className="py-3.5 px-3 text-center text-slate-700 font-medium whitespace-nowrap">
                        {row.screen_size || '14"'}
                      </td>

                      {/* 9. Stok Fisik */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-blue-600 whitespace-nowrap">
                        {row.physical_stock || 0}
                      </td>

                      {/* 10. Status */}
                      <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          row.status === 'TERSEDIA' && (row.physical_stock > 0)
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                            : 'bg-rose-50 text-rose-700 border border-rose-200/80'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            row.status === 'TERSEDIA' && (row.physical_stock > 0)
                              ? 'bg-emerald-500'
                              : 'bg-rose-500'
                          }`} />
                          <span>
                            {row.status === 'TERSEDIA' && (row.physical_stock > 0) ? 'Tersedia' : 'Tidak Tersedia'}
                          </span>
                        </span>
                      </td>

                      {/* 11. Action (Three-Dot Kebab Menu) */}
                      <td className="py-3.5 px-3 text-center relative">
                        <div className="relative inline-block" ref={activeMenuId === row.id ? menuRef : null}>
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === row.id ? null : row.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            aria-label="Menu Aksi"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Action Dropdown Menu */}
                          {activeMenuId === row.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl border border-slate-200 shadow-xl py-1.5 z-40 text-left animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={() => handleOpenDetailModal(row)}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>Lihat Detail</span>
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  navigate(`/admin/laptops/${row.id}/edit`);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                              >
                                <Edit className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit</span>
                              </button>
                              <div className="my-1 border-t border-slate-100" />
                              <button
                                onClick={() => {
                                  setDeleteConfirmLaptop(row);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-semibold"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>Hapus</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          /* ========================================================
              VIEW MODE: GRID CARDS VIEW
              ======================================================== */
          <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(n => (
                <div key={n} className="p-4 rounded-2xl border border-slate-200 space-y-3 animate-pulse bg-slate-50">
                  <div className="h-32 bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
              ))
            ) : laptops.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400">
                <div className="flex flex-col items-center justify-center gap-2">
                  <LaptopIcon className="w-8 h-8 text-slate-300 stroke-1" />
                  <p className="font-medium text-slate-600">Tidak ada data ditemukan</p>
                  <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau filter yang dipilih.</p>
                </div>
              </div>
            ) : (
              laptops.map(row => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-3 hover:shadow-md hover:border-blue-200 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    {/* Header Card */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                        {row.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.condition_type === 'BARU' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {row.condition_type}
                      </span>
                    </div>

                    {/* Image / Placeholder */}
                    <div className="w-full h-36 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100">
                      {row.primary_image ? (
                        <img src={row.primary_image} alt={row.name} className="w-full h-full object-cover" />
                      ) : (
                        <LaptopIcon className="w-12 h-12 text-slate-300 stroke-1" />
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[11px] font-semibold text-slate-700">{row.brand_name}</span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[11px] text-slate-500 font-medium">{row.category_name}</span>
                      </div>
                      <Link
                        to={`/admin/laptops/${row.id}`}
                        className="font-bold text-slate-900 text-sm line-clamp-1 hover:text-blue-600 transition-colors block"
                      >
                        {row.name}
                      </Link>
                      <p className="text-[11px] text-slate-400 font-mono line-clamp-1">{row.processor || 'Intel / AMD'}</p>
                    </div>
                  </div>

                  {/* Price & Stock */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Harga Jual</span>
                      <span className="text-sm font-bold text-slate-900 font-mono">{formatRupiah(row.selling_price)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenDetailModal(row)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                        title="Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/laptops/${row.id}/edit`)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Bottom Pagination Bar */}
        <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50/50">
          <div>
            Menampilkan <strong className="text-slate-900 font-mono">
              {laptops.length === 0 ? 0 : (pagination.current_page - 1) * (pagination.limit || 10) + 1}
            </strong> sampai <strong className="text-slate-900 font-mono">
              {laptops.length === 0 ? 0 : Math.min(pagination.current_page * (pagination.limit || 10), pagination.total_items ?? laptops.length)}
            </strong> dari <strong className="text-slate-900 font-mono">{pagination.total_items ?? laptops.length}</strong> data
          </div>

          <div className="flex items-center gap-1.5 self-center sm:self-auto">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={pagination.current_page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: pagination.total_pages || 1 }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  pagination.current_page === p
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.total_pages))}
              disabled={pagination.current_page >= pagination.total_pages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Halaman Berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
      {/* ========================================================
          6. MODALS: ADD/EDIT LAPTOP MODAL
          ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-100">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-modal overflow-hidden my-8 animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900">
                {editingLaptop ? 'Edit Data Laptop' : 'Tambah Laptop Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto text-xs">
              
              {/* Seksi 1: Informasi Utama */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">1. Informasi Utama</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kode Laptop *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. LPT-TEST-0043"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Laptop *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ASUS Zenbook S 13 OLED"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Merek *</label>
                    <select
                      required
                      value={formData.brand_id}
                      onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                    >
                      <option value="">Pilih Merek</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kategori *</label>
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Seksi 2: Jenis Barang & Sumber Pengadaan */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">2. Jenis Barang & Sumber Pengadaan</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jenis Barang *</label>
                    <select
                      value={formData.condition_type}
                      onChange={(e) => {
                        const cond = e.target.value;
                        setFormData({
                          ...formData,
                          condition_type: cond,
                          source_type: cond === 'BARU' ? 'MASTER_DEALER' : 'DEALER'
                        });
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none"
                    >
                      <option value="BARU">Laptop Baru</option>
                      <option value="SECOND">Laptop Second</option>
                    </select>
                  </div>

                  {formData.condition_type === 'BARU' ? (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Master Dealer *</label>
                      <select
                        required
                        value={formData.master_dealer_id}
                        onChange={(e) => setFormData({ ...formData, master_dealer_id: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                      >
                        <option value="">Pilih Master Dealer (MD 1, MD 2, MD 3)</option>
                        {masterDealers.map(md => <option key={md.id} value={md.id}>{md.name} ({md.code})</option>)}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Asal Pengadaan Second *</label>
                      <select
                        value={formData.source_type}
                        onChange={(e) => setFormData({ ...formData, source_type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                      >
                        <option value="DEALER">Dealer (Toko Lain)</option>
                        <option value="PEMILIK">Pemilik / Customer Langsung</option>
                      </select>
                    </div>
                  )}
                </div>

                {formData.condition_type === 'SECOND' && formData.source_type === 'DEALER' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pilih Dealer (Toko Lain) *</label>
                    <select
                      required
                      value={formData.dealer_id}
                      onChange={(e) => setFormData({ ...formData, dealer_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                    >
                      <option value="">Pilih Dealer Mitra</option>
                      {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                )}

                {formData.condition_type === 'SECOND' && formData.source_type === 'PEMILIK' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Nama Pemilik / Customer *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Budi Santoso"
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Kontak Customer</label>
                      <input
                        type="text"
                        placeholder="0812-xxxx-xxxx"
                        value={formData.customer_contact}
                        onChange={(e) => setFormData({ ...formData, customer_contact: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Seksi 3: Spesifikasi Hardware */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">3. Spesifikasi Hardware</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Processor</label>
                    <input
                      type="text"
                      placeholder="e.g. Intel Core i7-13650HX"
                      value={formData.processor}
                      onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">RAM</label>
                    <input
                      type="text"
                      placeholder="e.g. 16 GB DDR5"
                      value={formData.ram}
                      onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Storage</label>
                    <input
                      type="text"
                      placeholder="e.g. 1 TB NVMe SSD"
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">GPU / Kartu Grafis</label>
                    <input
                      type="text"
                      placeholder="e.g. RTX 4060 8GB"
                      value={formData.gpu}
                      onChange={(e) => setFormData({ ...formData, gpu: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ukuran Layar (Display)</label>
                    <input
                      type="text"
                      placeholder="e.g. 14 inch OLED"
                      value={formData.screen_size}
                      onChange={(e) => setFormData({ ...formData, screen_size: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Garansi</label>
                    <input
                      type="text"
                      placeholder="e.g. Resmi 2 Tahun"
                      value={formData.warranty}
                      onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                </div>

                {formData.condition_type === 'SECOND' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Catatan Fisik / Kondisi Second</label>
                    <textarea
                      rows="2"
                      placeholder="Kondisi body, layar, kelengkapan, battery health..."
                      value={formData.condition_notes}
                      onChange={(e) => setFormData({ ...formData, condition_notes: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                )}
              </div>

              {/* Seksi 4: Inventaris & Harga Jual */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">4. Inventaris & Harga Jual</span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Harga Beli / Modal *</label>
                    <input
                      type="number"
                      required
                      value={formData.purchase_price}
                      onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Harga Jual *</label>
                    <input
                      type="number"
                      required
                      value={formData.selling_price}
                      onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-blue-50/60 border border-blue-200 text-blue-700 text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stok Display</label>
                    <input
                      type="number"
                      value={formData.display_stock}
                      onChange={(e) => setFormData({ ...formData, display_stock: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stok Fisik *</label>
                    <input
                      type="number"
                      required
                      value={formData.physical_stock}
                      onChange={(e) => setFormData({ ...formData, physical_stock: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 5: Status & URL Foto */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">5. Status & URL Foto</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Status Inventaris</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold"
                    >
                      <option value="TERSEDIA">Tersedia</option>
                      <option value="HABIS">Habis</option>
                      <option value="DISPLAY">Display</option>
                      <option value="TERJUAL">Terjual</option>
                      <option value="TIDAK_AKTIF">Tidak Aktif</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">URL Foto Utama</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.primary_image}
                      onChange={(e) => setFormData({ ...formData, primary_image: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : editingLaptop ? 'Simpan Perubahan' : 'Tambah Laptop'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}



      {/* ========================================================
          8. DELETE CONFIRMATION DIALOG
          ======================================================== */}
      {deleteConfirmLaptop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">Hapus Data Laptop?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus laptop <strong className="text-slate-800">{deleteConfirmLaptop.name}</strong> ({deleteConfirmLaptop.code})?
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmLaptop(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminLaptopsPage;

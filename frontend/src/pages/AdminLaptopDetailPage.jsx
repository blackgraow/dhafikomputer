import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Home,
  ChevronRight,
  Package,
  Layers,
  Tag,
  Building2,
  Store,
  Calendar,
  DollarSign,
  Cpu,
  HardDrive,
  Monitor,
  ShieldCheck,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Boxes,
  HelpCircle,
  X,
  Laptop as LaptopIcon,
  Sparkles,
  ExternalLink,
  Shield,
  Palette,
  Scale,
  Maximize2
} from 'lucide-react';

const AdminLaptopDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('SPECS'); // 'SPECS', 'FINANCE', 'HISTORY'

  // Master data for editing
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterDealers, setMasterDealers] = useState([]);
  const [dealers, setDealers] = useState([]);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Edit form state
  const [formData, setFormData] = useState({
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
    screen_size: '',
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
  });

  useEffect(() => {
    fetchLaptopDetail();
    fetchMetadata();
  }, [id]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
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

  const fetchLaptopDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/laptops/${id}`);
      if (res.data.success) {
        const item = res.data.data;
        setLaptop(item);
        setFormData({
          code: item.code || '',
          name: item.name || '',
          brand_id: item.brand_id || '',
          category_id: item.category_id || '',
          condition_type: item.condition_type || 'BARU',
          source_type: item.source_type || 'MASTER_DEALER',
          master_dealer_id: item.master_dealer_id || '',
          dealer_id: item.dealer_id || '',
          customer_name: item.customer_name || '',
          customer_contact: item.customer_contact || '',
          customer_notes: item.customer_notes || '',
          processor: item.processor || '',
          ram: item.ram || '',
          storage: item.storage || '',
          gpu: item.gpu || '',
          screen_size: item.screen_size || '14"',
          operating_system: item.operating_system || 'Windows 11 Home',
          color: item.color || '',
          release_year: item.release_year || '2024',
          warranty: item.warranty || '',
          serial_number: item.serial_number || '',
          condition_notes: item.condition_notes || '',
          purchase_price: item.purchase_price || 0,
          selling_price: item.selling_price || 0,
          display_stock: item.display_stock || 0,
          physical_stock: item.physical_stock || 0,
          status: item.status || 'TERSEDIA',
          description: item.description || '',
          primary_image: item.primary_image || ''
        });
      } else {
        setError('Data laptop tidak ditemukan.');
      }
    } catch (err) {
      console.error('Fetch laptop detail error:', err);
      setError('Gagal memuat detail laptop. Periksa koneksi backend Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
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

      const res = await api.put(`/laptops/${id}`, payload);
      if (res.data.success) {
        showToast('Data laptop berhasil diperbarui!');
        setIsEditModalOpen(false);
        fetchLaptopDetail();
      }
    } catch (err) {
      console.error('Update laptop error:', err);
      showToast(err.response?.data?.message || 'Gagal memperbarui data laptop', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await api.delete(`/laptops/${id}`);
      if (res.data.success) {
        navigate('/admin/laptops', { state: { toastMessage: 'Data laptop berhasil dihapus!' } });
      }
    } catch (err) {
      console.error('Delete laptop error:', err);
      showToast(err.response?.data?.message || 'Gagal menghapus data laptop', 'error');
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };


  // Loading skeleton state
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 bg-slate-200 rounded w-48" />
        
        {/* Header Skeleton */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-200">
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded w-40" />
            <div className="h-4 bg-slate-100 rounded w-72" />
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-slate-200 rounded-xl w-24" />
            <div className="h-9 bg-slate-200 rounded-xl w-24" />
          </div>
        </div>

        {/* Product Card Skeleton */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 h-64" />

        {/* Specs Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 h-80" />
          <div className="p-6 bg-white rounded-2xl border border-slate-200 h-80" />
        </div>
      </div>
    );
  }

  // Error State
  if (error || !laptop) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 my-8 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">{error || 'Data laptop tidak ditemukan'}</h3>
          <p className="text-xs text-slate-500">Unit laptop mungkin telah dihapus atau URL tidak valid.</p>
        </div>
        <button
          onClick={() => navigate('/admin/laptops')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Data Laptop</span>
        </button>
      </div>
    );
  }

  const isAvailable = laptop.status === 'TERSEDIA' && (laptop.physical_stock > 0);
  const marginValue = parseFloat(laptop.selling_price || 0) - parseFloat(laptop.purchase_price || 0);
  const marginPercent = laptop.purchase_price > 0 
    ? ((marginValue / laptop.purchase_price) * 100).toFixed(1)
    : '0';
  const totalAssetVal = (parseInt(laptop.physical_stock, 10) || 0) * (parseFloat(laptop.selling_price) || 0);

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-12 animate-in fade-in duration-150">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-2 duration-150 ${
          toast.type === 'error'
            ? 'bg-rose-50 text-rose-800 border-rose-200'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ========================================================
          1. BREADCRUMB & HEADER ACTIONS
          ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Link to="/admin/dashboard" className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/admin/laptops" className="hover:text-blue-600 transition-colors">
            Data Laptop
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold">Detail Laptop</span>
        </nav>

        {/* Action Buttons (Kembali, Edit, Hapus) */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={() => navigate('/admin/laptops')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>

          <button
            onClick={() => navigate(`/admin/laptops/${id}/edit`)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/60 hover:bg-rose-100 text-rose-600 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Hapus Data Laptop"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Hapus</span>
          </button>
        </div>

      </div>

      {/* ========================================================
          2. PRODUCT HEADER CARD (HORIZONTAL OVERVIEW)
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 sm:p-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Column Left: Laptop Thumbnail (~220-260px) */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <div className="relative w-full max-w-[260px] h-48 sm:h-52 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 overflow-hidden group">
              {laptop.primary_image ? (
                <img
                  src={laptop.primary_image}
                  alt={laptop.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <svg viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 h-32 drop-shadow-md">
                    <ellipse cx="100" cy="115" rx="75" ry="12" fill="#2563EB" fillOpacity="0.15" />
                    <path d="M30 95 L170 95 L155 110 L45 110 Z" fill="#0F172A" />
                    <path d="M45 110 L155 110 L150 114 L50 114 Z" fill="#334155" />
                    <rect x="85" y="98" width="30" height="8" rx="2" fill="#1E293B" stroke="#475569" strokeWidth="0.5" />
                    <path d="M42 95 L55 25 L145 25 L158 95 Z" fill="#090E17" stroke="#1E293B" strokeWidth="2" />
                    <path d="M48 91 L58 30 L142 30 L152 91 Z" fill="#1D4ED8" fillOpacity="0.8" />
                    <rect x="68" y="38" width="64" height="6" rx="2" fill="#FFFFFF" fillOpacity="0.8" />
                    <rect x="68" y="48" width="40" height="4" rx="1.5" fill="#93C5FD" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Column Middle: Laptop Main Info & Chips */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {laptop.name}
              </h2>
              
              {/* Code & Status Row */}
              <div className="flex flex-wrap items-center gap-2.5 mt-2">
                <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                  {laptop.code}
                </span>

                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                  isAvailable
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <span>{isAvailable ? 'Tersedia' : 'Tidak Tersedia'}</span>
                </span>
              </div>
            </div>

            {/* 4 Info Chips (Merek, Kategori, Jenis, Sumber) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-100 text-xs">
              
              {/* Merek */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Merek</span>
                <span className="font-bold text-slate-800 block truncate">{laptop.brand_name || '-'}</span>
              </div>

              {/* Kategori */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kategori</span>
                <span className="font-semibold text-slate-800 block truncate">{laptop.category_name}</span>
              </div>

              {/* Jenis */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Jenis</span>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  laptop.condition_type === 'BARU' ? 'bg-blue-50 text-blue-600 border border-blue-200/80' : 'bg-amber-50 text-amber-700 border border-amber-200/80'
                }`}>
                  {laptop.condition_type}
                </span>
              </div>

              {/* Sumber */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sumber</span>
                <span className="font-semibold text-slate-800 block truncate text-[11px]">
                  {laptop.condition_type === 'BARU' 
                    ? (laptop.master_dealer_name || 'MD 1') 
                    : (laptop.dealer_name || laptop.customer_name || 'Dealer/Customer')}
                </span>
              </div>

            </div>

          </div>

          {/* Column Right: "Informasi Stok & Harga" Card */}
          <div className="lg:col-span-3">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-slate-50 border border-blue-100/90 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">Informasi Stok & Harga</span>
                <div className="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>

              {/* Big Price */}
              <div>
                <span className="text-[11px] text-slate-500 font-medium block">Harga Jual</span>
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight mt-0.5">
                  {formatRupiah(laptop.selling_price)}
                </div>
              </div>

              {/* Bottom 2 Mini Metric Boxes */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-100/80">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Display</span>
                  <span className="text-xs font-bold text-slate-800 font-mono">{laptop.screen_size || '14"'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200/80">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Stok Fisik</span>
                  <span className="text-xs font-bold text-blue-600 font-mono">{laptop.physical_stock || 0} Unit</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          3. TAB NAVIGATION (Spesifikasi & Sumber, Kalkulasi Margin, Mutasi Stok)
          ======================================================== */}
      <div className="flex gap-2 border-b border-slate-200 text-xs">
        <button
          onClick={() => setActiveTab('SPECS')}
          className={`pb-3 px-4 font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'SPECS'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Spesifikasi & Sumber
        </button>

        <button
          onClick={() => setActiveTab('FINANCE')}
          className={`pb-3 px-4 font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'FINANCE'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Kalkulasi Margin & Aset
        </button>

        <button
          onClick={() => setActiveTab('HISTORY')}
          className={`pb-3 px-4 font-bold transition-colors border-b-2 cursor-pointer ${
            activeTab === 'HISTORY'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Mutasi Stok
        </button>
      </div>

      {/* ========================================================
          4. TAB CONTENT: SPESIFIKASI & SUMBER
          ======================================================== */}
      {activeTab === 'SPECS' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (8 cols): Spesifikasi Laptop */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <LaptopIcon className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Spesifikasi Laptop</h3>
                <p className="text-[11px] text-slate-400">Rincian hardware dan konfigurasi teknis unit.</p>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              
              {/* Processor */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Processor</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 block font-mono">
                  {laptop.processor || '-'}
                </span>
              </div>

              {/* RAM */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">RAM</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 block font-mono">
                  {laptop.ram || '-'}
                </span>
              </div>

              {/* Storage */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <HardDrive className="w-3.5 h-3.5 text-purple-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Storage</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 block font-mono">
                  {laptop.storage || '-'}
                </span>
              </div>

              {/* GPU */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Monitor className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">GPU / Grafis</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 block font-mono">
                  {laptop.gpu || '-'}
                </span>
              </div>

              {/* Ukuran Layar */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Ukuran Layar</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 block">
                  {laptop.screen_size || '14 inch'}
                </span>
              </div>

              {/* Sistem Operasi */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Sistem Operasi</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 block">
                  {laptop.operating_system || 'Windows 11 Home'}
                </span>
              </div>

              {/* Warna */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Palette className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Warna</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 block">
                  {laptop.color || 'Basalt Grey'}
                </span>
              </div>

              {/* Tahun Rilis */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Tahun Rilis</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 block font-mono">
                  {laptop.release_year || '2024'}
                </span>
              </div>

              {/* Garansi */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Garansi</span>
                </div>
                <span className="text-xs font-semibold text-slate-900 block">
                  {laptop.warranty || 'Resmi 2 Tahun'}
                </span>
              </div>

            </div>

          </div>

          {/* Right Column (4 cols): Informasi Sumber */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Informasi Sumber</h3>
                <p className="text-[11px] text-slate-400">Data asal pengadaan dan riwayat masuk.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Sumber Pengadaan */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sumber Pengadaan</span>
                <p className="font-semibold text-slate-900">
                  {laptop.condition_type === 'BARU'
                    ? (laptop.master_dealer_name ? `${laptop.master_dealer_name}` : 'MD 1 (Master Dealer Utama)')
                    : laptop.source_type === 'DEALER'
                    ? (laptop.dealer_name || 'Dealer Toko Lain')
                    : (laptop.customer_name ? `Pemilik: ${laptop.customer_name}` : 'Pemilik / Customer')}
                </p>
              </div>

              {/* Tanggal Masuk */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tanggal Masuk</span>
                <p className="font-semibold text-slate-900 font-mono">
                  {formatDate(laptop.created_at || '2026-08-16')}
                </p>
              </div>

              {/* Nomor Referensi */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Nomor Referensi</span>
                <p className="font-semibold text-slate-900 font-mono">
                  {laptop.transactions?.[0]?.transaction_code || 'TRX-IN-30018426'}
                </p>
              </div>

              {/* Kondisi */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kondisi</span>
                <p className="font-semibold text-slate-900">
                  {laptop.condition_type === 'BARU' ? 'Baru (Segel Pabrik)' : `Second (${laptop.condition_notes || 'Mulus'})`}
                </p>
              </div>

              {/* Garansi */}
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Garansi Toko / Resmi</span>
                <p className="font-semibold text-slate-900">
                  {laptop.warranty || '12 Bulan Resmi'}
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          5. TAB CONTENT: KALKULASI MARGIN & ASET
          ======================================================== */}
      {activeTab === 'FINANCE' && (
        <div className="space-y-6">
          
          {/* 4 Financial Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            
            {/* Modal */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Harga Modal / Beli</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono">
                {formatRupiah(laptop.purchase_price)}
              </div>
              <span className="text-[10px] text-slate-400 block">Biaya pengadaan awal</span>
            </div>

            {/* Jual */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Harga Jual Resmi</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono">
                {formatRupiah(laptop.selling_price)}
              </div>
              <span className="text-[10px] text-slate-400 block">Harga patokan toko</span>
            </div>

            {/* Margin */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">Margin / Unit</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                </span>
              </div>
              <div className="text-xl font-extrabold text-emerald-900 font-mono">
                {formatRupiah(marginValue)}
              </div>
              <span className="text-[10px] text-emerald-700 block">Estimasi keuntungan kotor per unit</span>
            </div>

            {/* Total Nilai Aset */}
            <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200/80 shadow-xs space-y-2">
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">Total Nilai Stok Fisik</span>
              <div className="text-xl font-extrabold text-blue-900 font-mono">
                {formatRupiah(totalAssetVal)}
              </div>
              <span className="text-[10px] text-blue-700 block">{laptop.physical_stock || 0} Unit × Harga Jual</span>
            </div>

          </div>

          {/* Detailed Financial Summary Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Rincian Perhitungan Keuangan</h3>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Komponen Finansial</th>
                    <th className="py-3 px-4 text-center">Jumlah Unit</th>
                    <th className="py-3 px-4 text-right">Nilai Per Unit</th>
                    <th className="py-3 px-4 text-right">Total Akumulasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-800">Total Modal Pengadaan</td>
                    <td className="py-3 px-4 text-center font-mono">{laptop.physical_stock || 0}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatRupiah(laptop.purchase_price)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatRupiah((laptop.purchase_price || 0) * (laptop.physical_stock || 0))}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-slate-800">Total Potensi Omzet Penjualan</td>
                    <td className="py-3 px-4 text-center font-mono">{laptop.physical_stock || 0}</td>
                    <td className="py-3 px-4 text-right font-mono">{formatRupiah(laptop.selling_price)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-blue-600">
                      {formatRupiah(totalAssetVal)}
                    </td>
                  </tr>
                  <tr className="bg-emerald-50/50">
                    <td className="py-3 px-4 font-bold text-emerald-900">Total Estimasi Laba Kotor</td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-900">{laptop.physical_stock || 0}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-900">{formatRupiah(marginValue)}</td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-emerald-700">
                      {formatRupiah(marginValue * (laptop.physical_stock || 0))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          6. TAB CONTENT: MUTASI STOK
          ======================================================== */}
      {activeTab === 'HISTORY' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          <div className="p-5 sm:px-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Riwayat Mutasi Stok</h3>
              <p className="text-xs text-slate-400 mt-0.5">Catatan seluruh transaksi masuk dan keluar untuk unit ini.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            {laptop.transactions && laptop.transactions.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Nomor Transaksi</th>
                    <th className="py-3 px-3">Jenis</th>
                    <th className="py-3 px-4">Sumber / Tujuan</th>
                    <th className="py-3 px-3 text-center">Jumlah</th>
                    <th className="py-3 px-4">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {laptop.transactions.map((trx, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-mono whitespace-nowrap">
                        {formatDate(trx.transaction_date)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {trx.transaction_code}
                      </td>
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          trx.type === 'MASUK'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}>
                          {trx.type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        {trx.source_destination || '-'}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-900 whitespace-nowrap">
                        {trx.quantity} Unit
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                        {trx.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center space-y-2">
                <History className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Belum Ada Riwayat Mutasi</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Belum ada transaksi barang masuk atau keluar yang tercatat untuk kode unit ini.
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================
          9. EDIT LAPTOP MODAL
          ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-100">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-modal overflow-hidden my-8 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-sm font-bold text-slate-900">Edit Data Laptop</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-6 max-h-[78vh] overflow-y-auto text-xs">
              
              {/* Seksi 1: Informasi Utama */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">1. Informasi Utama</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Kode Laptop *</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Laptop *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Merek *</label>
                    <select
                      required
                      value={formData.brand_id}
                      onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white"
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                      >
                        <option value="">Pilih Master Dealer</option>
                        {masterDealers.map(md => <option key={md.id} value={md.id}>{md.name} ({md.code})</option>)}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Asal Pengadaan Second *</label>
                      <select
                        value={formData.source_type}
                        onChange={(e) => setFormData({ ...formData, source_type: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                      >
                        <option value="DEALER">Dealer (Toko Lain)</option>
                        <option value="PEMILIK">Pemilik / Customer Langsung</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Seksi 3: Spesifikasi Hardware */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">3. Spesifikasi Hardware</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Processor</label>
                    <input
                      type="text"
                      value={formData.processor}
                      onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">RAM</label>
                    <input
                      type="text"
                      value={formData.ram}
                      onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Storage</label>
                    <input
                      type="text"
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">GPU / Kartu Grafis</label>
                    <input
                      type="text"
                      value={formData.gpu}
                      onChange={(e) => setFormData({ ...formData, gpu: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ukuran Layar</label>
                    <input
                      type="text"
                      value={formData.screen_size}
                      onChange={(e) => setFormData({ ...formData, screen_size: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Garansi</label>
                    <input
                      type="text"
                      value={formData.warranty}
                      onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Seksi 4: Inventaris & Harga */}
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
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono font-bold text-blue-600"
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
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          10. DELETE CONFIRMATION MODAL
          ======================================================== */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-100">
          <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-base font-bold text-slate-900">Hapus Laptop?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus data laptop <strong className="text-slate-800">{laptop.name}</strong> ({laptop.code})?
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
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

export default AdminLaptopDetailPage;

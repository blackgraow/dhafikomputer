import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Home,
  ChevronRight,
  Save,
  ArrowLeft,
  X,
  FileText,
  Layers,
  Laptop as LaptopIcon,
  DollarSign,
  Image as ImageIcon,
  MessageSquare,
  ShieldCheck,
  Zap,
  BarChart3,
  Upload,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Building2,
  Cpu,
  RefreshCw,
  Trash2
} from 'lucide-react';

const AdminLaptopCreatePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Metadata dropdown options
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterDealers, setMasterDealers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Form State
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
    warranty: '',
    operating_system: '',
    panel_type: '',
    color: '',
    weight: '',
    release_year: '',
    purchase_price: '',
    selling_price: '',
    display_stock: 0,
    physical_stock: 1,
    status: 'TERSEDIA',
    primary_image: '',
    description: ''
  });

  // UI state
  const [previewImage, setPreviewImage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchMetadata = async () => {
    setLoadingMeta(true);
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
      showToast('Gagal memuat data master dealer / merek', 'error');
    } finally {
      setLoadingMeta(false);
    }
  };

  // Auto Generate Sample Code
  const handleGenerateCode = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setFormData(prev => ({ ...prev, code: `LPT-${randomSuffix}` }));
    if (errors.code) setErrors(prev => ({ ...prev, code: null }));
  };

  // Image Upload handler via FileReader
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, primary_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    setFormData(prev => ({ ...prev, primary_image: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.code.trim()) errs.code = 'Kode Laptop wajib diisi';
    if (!formData.name.trim()) errs.name = 'Nama Laptop wajib diisi';
    if (!formData.brand_id) errs.brand_id = 'Merek wajib dipilih';
    if (!formData.category_id) errs.category_id = 'Kategori wajib dipilih';
    if (!formData.condition_type) errs.condition_type = 'Jenis Barang wajib dipilih';

    if (formData.condition_type === 'BARU') {
      if (!formData.master_dealer_id) errs.master_dealer_id = 'Master Dealer wajib dipilih untuk laptop baru';
    } else {
      if (formData.source_type === 'DEALER' && !formData.dealer_id) {
        errs.dealer_id = 'Dealer mitra wajib dipilih';
      }
      if (formData.source_type === 'PEMILIK' && !formData.customer_name?.trim()) {
        errs.customer_name = 'Nama pemilik/customer wajib diisi';
      }
    }

    if (formData.purchase_price === '' || isNaN(formData.purchase_price) || Number(formData.purchase_price) < 0) {
      errs.purchase_price = 'Harga Beli/Modal harus berupa angka positif';
    }
    if (formData.selling_price === '' || isNaN(formData.selling_price) || Number(formData.selling_price) < 0) {
      errs.selling_price = 'Harga Jual harus berupa angka positif';
    }
    if (formData.physical_stock === '' || isNaN(formData.physical_stock) || Number(formData.physical_stock) < 0) {
      errs.physical_stock = 'Stok Fisik wajib diisi (minimal 0)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const isFormValid = Boolean(
    formData.code?.trim() &&
    formData.name?.trim() &&
    formData.brand_id &&
    formData.category_id &&
    formData.condition_type &&
    (formData.condition_type === 'BARU'
      ? Boolean(formData.master_dealer_id)
      : (formData.source_type === 'DEALER' ? Boolean(formData.dealer_id) : Boolean(formData.customer_name?.trim()))
    ) &&
    formData.purchase_price !== '' &&
    !isNaN(formData.purchase_price) &&
    Number(formData.purchase_price) >= 0 &&
    formData.selling_price !== '' &&
    !isNaN(formData.selling_price) &&
    Number(formData.selling_price) >= 0 &&
    formData.physical_stock !== '' &&
    !isNaN(formData.physical_stock) &&
    Number(formData.physical_stock) >= 0
  );

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validateForm()) {
      showToast('Mohon lengkapi seluruh field wajib bertanda bintang (*)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        brand_id: parseInt(formData.brand_id, 10),
        category_id: parseInt(formData.category_id, 10),
        condition_type: formData.condition_type,
        source_type: formData.condition_type === 'BARU' ? 'MASTER_DEALER' : formData.source_type,
        master_dealer_id: formData.condition_type === 'BARU' && formData.master_dealer_id ? parseInt(formData.master_dealer_id, 10) : null,
        dealer_id: formData.condition_type === 'SECOND' && formData.source_type === 'DEALER' && formData.dealer_id ? parseInt(formData.dealer_id, 10) : null,
        customer_name: formData.condition_type === 'SECOND' && formData.source_type === 'PEMILIK' ? formData.customer_name : null,
        customer_contact: formData.condition_type === 'SECOND' && formData.source_type === 'PEMILIK' ? formData.customer_contact : null,
        customer_notes: formData.condition_type === 'SECOND' && formData.source_type === 'PEMILIK' ? formData.customer_notes : null,
        processor: formData.processor.trim(),
        ram: formData.ram.trim(),
        storage: formData.storage.trim(),
        gpu: formData.gpu.trim(),
        screen_size: formData.screen_size.trim() || '14 Inch',
        warranty: formData.warranty.trim(),
        operating_system: formData.operating_system.trim(),
        color: formData.color.trim(),
        release_year: formData.release_year.trim(),
        purchase_price: parseFloat(formData.purchase_price) || 0,
        selling_price: parseFloat(formData.selling_price) || 0,
        display_stock: parseInt(formData.display_stock, 10) || 0,
        physical_stock: parseInt(formData.physical_stock, 10) || 0,
        status: formData.status,
        primary_image: previewImage || formData.primary_image.trim(),
        description: formData.description.trim()
      };

      const res = await api.post('/laptops', payload);
      if (res.data.success) {
        showToast('Laptop baru berhasil ditambahkan!');
        setTimeout(() => {
          navigate('/admin/laptops');
        }, 1000);
      }
    } catch (err) {
      console.error('Create laptop error:', err);
      showToast(err.response?.data?.message || 'Gagal menambahkan laptop baru', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-900 pb-12 animate-in fade-in duration-150">
      
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
          1. BREADCRUMB
          ======================================================== */}
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
        <span className="text-blue-600 font-bold">Tambah Laptop Baru</span>
      </nav>

      {/* ========================================================
          2. PAGE HEADER
          ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tambah Laptop Baru
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Lengkapi informasi laptop untuk menambah data inventaris baru.
          </p>
        </div>

        <Link
          to="/admin/laptops"
          className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>Kembali ke Daftar Laptop</span>
        </Link>
      </div>

      {/* ========================================================
          3. MAIN FORM GRID (2 COLUMNS)
          ======================================================== */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================
            KOLOM KIRI (7 COLS): 1. Informasi Utama, 2. Sumber, 3. Spesifikasi
            ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Informasi Utama */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Informasi Utama</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Kode Laptop */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-700">Kode Laptop</label>
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    Auto
                  </button>
                </div>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => {
                    setFormData({ ...formData, code: e.target.value });
                    if (errors.code) setErrors({ ...errors, code: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 font-mono text-xs transition-colors focus:outline-none ${
                    errors.code ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.code && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.code}</p>}
              </div>

              {/* Nama Laptop */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Nama Laptop</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs transition-colors focus:outline-none ${
                    errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.name && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.name}</p>}
              </div>

              {/* Merek */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Merek</label>
                <select
                  value={formData.brand_id}
                  onChange={(e) => {
                    setFormData({ ...formData, brand_id: e.target.value });
                    if (errors.brand_id) setErrors({ ...errors, brand_id: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs transition-colors focus:outline-none cursor-pointer ${
                    errors.brand_id ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                >
                  <option value="">Pilih Merek</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {errors.brand_id && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.brand_id}</p>}
              </div>

              {/* Kategori */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Kategori</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => {
                    setFormData({ ...formData, category_id: e.target.value });
                    if (errors.category_id) setErrors({ ...errors, category_id: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs transition-colors focus:outline-none cursor-pointer ${
                    errors.category_id ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.category_id}</p>}
              </div>

            </div>
          </div>

          {/* Card 2: Jenis Barang & Sumber Pengadaan */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Jenis Barang & Sumber Pengadaan</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Jenis Barang */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Jenis Barang</label>
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
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold transition-colors focus:outline-none cursor-pointer"
                >
                  <option value="BARU">Laptop Baru</option>
                  <option value="SECOND">Laptop Second</option>
                </select>
              </div>

              {/* Master Dealer (Untuk Laptop Baru) */}
              {formData.condition_type === 'BARU' ? (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Master Dealer</label>
                  <select
                    value={formData.master_dealer_id}
                    onChange={(e) => {
                      setFormData({ ...formData, master_dealer_id: e.target.value });
                      if (errors.master_dealer_id) setErrors({ ...errors, master_dealer_id: null });
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs transition-colors focus:outline-none cursor-pointer ${
                      errors.master_dealer_id ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  >
                    <option value="">Pilih Master Dealer (MD 1, MD 2, MD 3)</option>
                    {masterDealers.map(md => (
                      <option key={md.id} value={md.id}>{md.name} ({md.code})</option>
                    ))}
                  </select>
                  {errors.master_dealer_id && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.master_dealer_id}</p>}
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Asal Pengadaan Second</label>
                  <select
                    value={formData.source_type}
                    onChange={(e) => setFormData({ ...formData, source_type: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs transition-colors focus:outline-none cursor-pointer"
                  >
                    <option value="DEALER">Dealer (Toko Lain)</option>
                    <option value="PEMILIK">Pemilik / Customer Langsung</option>
                  </select>
                </div>
              )}

            </div>

            {/* Conditional fields for Second */}
            {formData.condition_type === 'SECOND' && formData.source_type === 'DEALER' && (
              <div className="pt-3 border-t border-slate-100">
                <label className="block font-semibold text-slate-700 mb-1.5">Pilih Dealer Mitra</label>
                <select
                  value={formData.dealer_id}
                  onChange={(e) => setFormData({ ...formData, dealer_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                >
                  <option value="">Pilih Dealer Mitra</option>
                  {dealers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
            )}

            {formData.condition_type === 'SECOND' && formData.source_type === 'PEMILIK' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Nama Pemilik / Customer *</label>
                  <input
                    type="text"
                    placeholder="e.g. Budi Santoso"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Kontak Customer</label>
                  <input
                    type="text"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.customer_contact}
                    onChange={(e) => setFormData({ ...formData, customer_contact: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Spesifikasi Hardware (3 Kolom Grid Compact) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <LaptopIcon className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Spesifikasi Hardware</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              
              {/* Processor */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Processor</label>
                <input
                  type="text"
                  value={formData.processor}
                  onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

              {/* RAM */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">RAM</label>
                <input
                  type="text"
                  value={formData.ram}
                  onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

              {/* Storage */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Storage</label>
                <input
                  type="text"
                  value={formData.storage}
                  onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

              {/* GPU / Kartu Grafis */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">GPU / Kartu Grafis</label>
                <input
                  type="text"
                  value={formData.gpu}
                  onChange={(e) => setFormData({ ...formData, gpu: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

              {/* Ukuran Layar */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ukuran Layar (Display)</label>
                <input
                  type="text"
                  value={formData.screen_size}
                  onChange={(e) => setFormData({ ...formData, screen_size: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

              {/* Garansi */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Garansi</label>
                <input
                  type="text"
                  value={formData.warranty}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

              {/* Sistem Operasi */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sistem Operasi</label>
                <input
                  type="text"
                  value={formData.operating_system}
                  onChange={(e) => setFormData({ ...formData, operating_system: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

              {/* Tipe Panel */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipe Panel</label>
                <input
                  type="text"
                  value={formData.panel_type}
                  onChange={(e) => setFormData({ ...formData, panel_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

              {/* Warna */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Warna</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

              {/* Berat */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Berat</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

              {/* Tahun Rilis */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Rilis</label>
                <input
                  type="text"
                  value={formData.release_year}
                  onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none"
                />
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================
            KOLOM KANAN (5 COLS): 4. Inventaris & Harga, 5. Status & Foto, 6. Catatan
            ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 4: Inventaris & Harga */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <DollarSign className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Inventaris & Harga</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Harga Beli / Modal */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Harga Beli / Modal</label>
                <div className="relative rounded-xl overflow-hidden">
                  <span className="absolute inset-y-0 left-0 px-3 bg-slate-100 border-r border-slate-200 text-slate-500 font-bold text-xs flex items-center">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.purchase_price}
                    onChange={(e) => {
                      setFormData({ ...formData, purchase_price: e.target.value });
                      if (errors.purchase_price) setErrors({ ...errors, purchase_price: null });
                    }}
                    className={`w-full pl-12 pr-3 py-2.5 bg-slate-50 border text-slate-900 font-mono text-xs font-bold transition-colors focus:outline-none ${
                      errors.purchase_price ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.purchase_price && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.purchase_price}</p>}
              </div>

              {/* Harga Jual */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Harga Jual</label>
                <div className="relative rounded-xl overflow-hidden">
                  <span className="absolute inset-y-0 left-0 px-3 bg-blue-100/70 border-r border-blue-200 text-blue-700 font-bold text-xs flex items-center">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={formData.selling_price}
                    onChange={(e) => {
                      setFormData({ ...formData, selling_price: e.target.value });
                      if (errors.selling_price) setErrors({ ...errors, selling_price: null });
                    }}
                    className={`w-full pl-12 pr-3 py-2.5 bg-blue-50/40 border text-blue-700 font-mono text-xs font-bold transition-colors focus:outline-none ${
                      errors.selling_price ? 'border-rose-400 bg-rose-50/30' : 'border-blue-200'
                    }`}
                  />
                </div>
                {errors.selling_price && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.selling_price}</p>}
              </div>

              {/* Stok Display */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Stok Display</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.display_stock}
                  onChange={(e) => setFormData({ ...formData, display_stock: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs transition-colors focus:outline-none"
                />
              </div>

              {/* Stok Fisik */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Stok Fisik</label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.physical_stock}
                  onChange={(e) => {
                    setFormData({ ...formData, physical_stock: e.target.value });
                    if (errors.physical_stock) setErrors({ ...errors, physical_stock: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 font-mono text-xs font-bold transition-colors focus:outline-none ${
                    errors.physical_stock ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.physical_stock && <p className="text-[10px] text-rose-500 mt-1 font-medium">{errors.physical_stock}</p>}
              </div>

            </div>
          </div>

          {/* Card 5: Status & Foto */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Status & Foto</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Status Inventaris */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Status Inventaris</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold transition-colors focus:outline-none cursor-pointer"
                >
                  <option value="TERSEDIA">Tersedia</option>
                  <option value="HABIS">Habis</option>
                  <option value="DISPLAY">Display</option>
                  <option value="TERJUAL">Terjual</option>
                  <option value="TIDAK_AKTIF">Tidak Aktif</option>
                </select>
              </div>

              {/* URL Foto Utama */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">URL Foto Utama (Opsional)</label>
                <input
                  type="url"
                  value={formData.primary_image}
                  onChange={(e) => {
                    setFormData({ ...formData, primary_image: e.target.value });
                    if (!previewImage) setPreviewImage(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs transition-colors focus:outline-none"
                />
              </div>

            </div>

            {/* Upload Area */}
            <div className="pt-2">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {previewImage ? (
                <div className="relative p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-slate-900 block truncate">Foto Terpilih</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Siap diunggah ke katalog inventaris</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                    title="Hapus Foto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl border-2 border-dashed border-blue-200 hover:border-blue-500 bg-blue-50/30 hover:bg-blue-50/50 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block group-hover:text-blue-600 transition-colors">
                        Upload Foto Laptop
                      </span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        PNG, JPG, JPEG maksimal 5MB
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors shadow-2xs"
                  >
                    Pilih File
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Card 6: Catatan */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Catatan</h2>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-700">Catatan Tambahan (Opsional)</label>
              <textarea
                rows="3"
                maxLength="255"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs transition-colors focus:outline-none resize-none"
              />
              <div className="text-right text-[10px] text-slate-400 font-mono">
                {formData.description.length} / 255
              </div>
            </div>

            {/* Bottom Action Buttons inside card (aligned right) */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/admin/laptops')}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Menyimpan...' : 'Simpan Laptop'}</span>
              </button>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};

export default AdminLaptopCreatePage;

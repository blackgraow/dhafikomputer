import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import {
  ChevronRight,
  Save,
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
  Trash2,
  ArrowLeft,
  Shield
} from 'lucide-react';

const AdminLaptopEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Metadata dropdown options
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterDealers, setMasterDealers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const [imageFileName, setImageFileName] = useState('');
  const [imageFileSize, setImageFileSize] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [resB, resC, resMD, resD, resLaptop] = await Promise.all([
        api.get('/brands'),
        api.get('/categories'),
        api.get('/master-dealers'),
        api.get('/dealers'),
        api.get(`/laptops/${id}`)
      ]);

      if (resB.data?.success) setBrands(resB.data.data || []);
      if (resC.data?.success) setCategories(resC.data.data || []);
      if (resMD.data?.success) setMasterDealers(resMD.data.data || []);
      if (resD.data?.success) setDealers(resD.data.data || []);

      const item = resLaptop.data?.data || resLaptop.data;
      if (item) {
        setFormData({
          code: item.code ?? '',
          name: item.name ?? '',
          brand_id: item.brand_id ? String(item.brand_id) : (item.brand?.id ? String(item.brand.id) : ''),
          category_id: item.category_id ? String(item.category_id) : (item.category?.id ? String(item.category.id) : ''),
          condition_type: item.condition_type || item.item_type || 'BARU',
          source_type: item.source_type || 'MASTER_DEALER',
          master_dealer_id: item.master_dealer_id ? String(item.master_dealer_id) : '',
          dealer_id: item.dealer_id ? String(item.dealer_id) : '',
          customer_name: item.customer_name ?? '',
          customer_contact: item.customer_contact ?? '',
          customer_notes: item.customer_notes ?? '',
          processor: item.processor ?? '',
          ram: item.ram ?? '',
          storage: item.storage ?? '',
          gpu: item.gpu ?? '',
          screen_size: item.screen_size ?? item.display_size ?? '',
          warranty: item.warranty ?? '',
          operating_system: item.operating_system ?? item.os ?? '',
          panel_type: item.panel_type ?? '',
          color: item.color ?? '',
          weight: item.weight ?? '',
          release_year: item.release_year !== null && item.release_year !== undefined ? String(item.release_year) : '',
          purchase_price: item.purchase_price !== null && item.purchase_price !== undefined ? String(item.purchase_price) : '',
          selling_price: item.selling_price !== null && item.selling_price !== undefined ? String(item.selling_price) : '',
          display_stock: item.display_stock !== null && item.display_stock !== undefined ? Number(item.display_stock) : 0,
          physical_stock: item.physical_stock !== null && item.physical_stock !== undefined ? Number(item.physical_stock) : 1,
          status: item.status || item.inventory_status || 'TERSEDIA',
          primary_image: item.primary_image || item.photo_url || '',
          description: item.description || item.notes || ''
        });

        const img = item.primary_image || item.photo_url;
        if (img) {
          setPreviewImage(img);
          setImageFileName(item.name ? `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.jpg` : 'foto-laptop.jpg');
          setImageFileSize('1.2 MB');
        } else {
          setPreviewImage('');
          setImageFileName('');
          setImageFileSize('');
        }
      }
    } catch (err) {
      console.error('Fetch laptop data error:', err);
      showToast('Gagal memuat data laptop.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Ukuran file maksimal 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({ ...prev, primary_image: reader.result }));
        setImageFileName(file.name);
        setImageFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    setImageFileName('');
    setImageFileSize('');
    setFormData(prev => ({ ...prev, primary_image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.code.trim()) errs.code = 'Kode laptop wajib diisi';
    if (!formData.name.trim()) errs.name = 'Nama laptop wajib diisi';
    if (!formData.brand_id) errs.brand_id = 'Merek wajib dipilih';
    if (!formData.category_id) errs.category_id = 'Kategori wajib dipilih';
    if (!formData.purchase_price || Number(formData.purchase_price) <= 0) errs.purchase_price = 'Harga beli valid wajib diisi';
    if (!formData.selling_price || Number(formData.selling_price) <= 0) errs.selling_price = 'Harga jual valid wajib diisi';
    if (formData.physical_stock === '' || Number(formData.physical_stock) < 0) errs.physical_stock = 'Stok fisik valid wajib diisi';

    if (formData.condition_type === 'BARU' && !formData.master_dealer_id) {
      errs.master_dealer_id = 'Master Dealer wajib dipilih untuk Laptop Baru';
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
    e.preventDefault();
    if (!validateForm()) {
      showToast('Mohon lengkapi seluruh field wajib (*)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        brand_id: Number(formData.brand_id),
        category_id: Number(formData.category_id),
        condition_type: formData.condition_type,
        item_type: formData.condition_type,
        source_type: formData.condition_type === 'BARU' ? 'MASTER_DEALER' : formData.source_type,
        master_dealer_id: formData.condition_type === 'BARU' && formData.master_dealer_id ? Number(formData.master_dealer_id) : null,
        dealer_id: formData.condition_type === 'SECOND' && formData.source_type === 'DEALER' && formData.dealer_id ? Number(formData.dealer_id) : null,
        customer_name: formData.condition_type === 'SECOND' && formData.source_type === 'PEMILIK' ? formData.customer_name : null,
        customer_contact: formData.condition_type === 'SECOND' && formData.source_type === 'PEMILIK' ? formData.customer_contact : null,
        customer_notes: formData.condition_type === 'SECOND' && formData.source_type === 'PEMILIK' ? formData.customer_notes : null,
        processor: formData.processor || '',
        ram: formData.ram || '',
        storage: formData.storage || '',
        gpu: formData.gpu || '',
        screen_size: formData.screen_size || '',
        display_size: formData.screen_size || '',
        warranty: formData.warranty || '',
        operating_system: formData.operating_system || '',
        os: formData.operating_system || '',
        panel_type: formData.panel_type || '',
        color: formData.color || '',
        weight: formData.weight || '',
        release_year: formData.release_year ? String(formData.release_year) : '',
        purchase_price: Number(formData.purchase_price) || 0,
        selling_price: Number(formData.selling_price) || 0,
        display_stock: Number(formData.display_stock) || 0,
        physical_stock: Number(formData.physical_stock) || 0,
        status: formData.status,
        inventory_status: formData.status,
        primary_image: formData.primary_image || previewImage || '',
        photo_url: formData.primary_image || previewImage || '',
        description: formData.description || '',
        notes: formData.description || ''
      };

      const res = await api.put(`/laptops/${id}`, payload);
      if (res.data.success) {
        showToast('Data laptop berhasil diperbarui!', 'success');
        setTimeout(() => {
          navigate('/admin/laptops');
        }, 1000);
      }
    } catch (err) {
      console.error('Update laptop error:', err);
      showToast(err.response?.data?.message || 'Gagal menyimpan perubahan data laptop.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
          <div className="h-8 bg-slate-200 rounded w-64 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded w-80 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-48 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse" />
            <div className="h-32 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-200 ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ========================================================
          1. BREADCRUMB & HEADER SECTION
          ======================================================== */}
      <div className="space-y-3">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/admin/laptops" className="hover:text-blue-600 transition-colors">Data Laptop</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/admin/laptops/${id}`} className="hover:text-blue-600 transition-colors truncate max-w-[150px]">
            {formData.name || 'Detail Laptop'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-semibold">Edit Laptop</span>
        </nav>

        {/* Title Bar & Top Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Laptop: {formData.name || ''}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Ubah informasi laptop sesuai kebutuhan inventaris.
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

      </div>

      {/* ========================================================
          2. MAIN FORM GRID LAYOUT (2 COLUMNS: 7 / 5)
          ======================================================== */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ========================================================
            LEFT COLUMN (7 COLS): INFORMASI UTAMA, JENIS, HARDWARE
            ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SECTION 1: INFORMASI UTAMA */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <LaptopIcon className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Informasi Utama</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Kode Laptop */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Kode Laptop
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 font-mono text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.code ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.code && <span className="text-[11px] text-rose-500">{errors.code}</span>}
              </div>

              {/* Nama Laptop */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Nama Laptop
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.name ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.name && <span className="text-[11px] text-rose-500">{errors.name}</span>}
              </div>

              {/* Merek */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Merek
                </label>
                <select
                  required
                  value={formData.brand_id}
                  onChange={(e) => handleInputChange('brand_id', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.brand_id ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                >
                  <option value="">Pilih Merek</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                {errors.brand_id && <span className="text-[11px] text-rose-500">{errors.brand_id}</span>}
              </div>

              {/* Kategori */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Kategori
                </label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => handleInputChange('category_id', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.category_id ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.category_id && <span className="text-[11px] text-rose-500">{errors.category_id}</span>}
              </div>

            </div>
          </div>

          {/* SECTION 2: JENIS BARANG & SUMBER PENGADAAN */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Jenis Barang & Sumber Pengadaan</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Jenis Barang */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Jenis Barang
                </label>
                <select
                  required
                  value={formData.condition_type}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleInputChange('condition_type', val);
                    if (val === 'BARU') {
                      handleInputChange('source_type', 'MASTER_DEALER');
                    } else if (formData.source_type === 'MASTER_DEALER') {
                      handleInputChange('source_type', 'DEALER');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="BARU">Laptop Baru</option>
                  <option value="SECOND">Laptop Second</option>
                </select>
              </div>

              {/* Master Dealer / Sumber Mitra */}
              {formData.condition_type === 'BARU' ? (
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">
                    Master Dealer
                  </label>
                  <select
                    required
                    value={formData.master_dealer_id}
                    onChange={(e) => handleInputChange('master_dealer_id', e.target.value)}
                    className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                      errors.master_dealer_id ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-600'
                    }`}
                  >
                    <option value="">Pilih Master Dealer</option>
                    {masterDealers.map(md => (
                      <option key={md.id} value={md.id}>
                        {md.name} ({md.code})
                      </option>
                    ))}
                  </select>
                  {errors.master_dealer_id && <span className="text-[11px] text-rose-500">{errors.master_dealer_id}</span>}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="block font-semibold text-slate-700">
                    Dealer / Toko Mitra (Second)
                  </label>
                  <select
                    value={formData.dealer_id}
                    onChange={(e) => handleInputChange('dealer_id', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  >
                    <option value="">Pilih Dealer Mitra</option>
                    {dealers.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

            </div>
          </div>

          {/* SECTION 3: SPESIFIKASI HARDWARE (GRID 3 COLS) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Cpu className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Spesifikasi Hardware</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              
              {/* Processor */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Processor</label>
                <input
                  type="text"
                  value={formData.processor}
                  onChange={(e) => handleInputChange('processor', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* RAM */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">RAM</label>
                <input
                  type="text"
                  value={formData.ram}
                  onChange={(e) => handleInputChange('ram', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Storage */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Storage</label>
                <input
                  type="text"
                  value={formData.storage}
                  onChange={(e) => handleInputChange('storage', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* GPU / Kartu Grafis */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">GPU / Kartu Grafis</label>
                <input
                  type="text"
                  value={formData.gpu}
                  onChange={(e) => handleInputChange('gpu', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Ukuran Layar */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Ukuran Layar (Display)</label>
                <input
                  type="text"
                  value={formData.screen_size}
                  onChange={(e) => handleInputChange('screen_size', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Garansi */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Garansi</label>
                <input
                  type="text"
                  value={formData.warranty}
                  onChange={(e) => handleInputChange('warranty', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Sistem Operasi */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Sistem Operasi</label>
                <input
                  type="text"
                  value={formData.operating_system}
                  onChange={(e) => handleInputChange('operating_system', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Tipe Panel */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Tipe Panel</label>
                <input
                  type="text"
                  value={formData.panel_type}
                  onChange={(e) => handleInputChange('panel_type', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Warna */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Warna</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Berat */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Berat</label>
                <input
                  type="text"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Tahun Rilis */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Tahun Rilis</label>
                <input
                  type="number"
                  value={formData.release_year}
                  onChange={(e) => handleInputChange('release_year', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

            </div>
          </div>

        </div>

        {/* ========================================================
            RIGHT COLUMN (5 COLS): INVENTARIS & HARGA, FOTO, CATATAN
            ======================================================== */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SECTION 4: INVENTARIS & HARGA */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <DollarSign className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Inventaris & Harga</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Harga Beli */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Harga Beli / Modal
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-xs">Rp</span>
                  <input
                    type="number"
                    required
                    value={formData.purchase_price}
                    onChange={(e) => handleInputChange('purchase_price', e.target.value)}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 font-mono text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                      errors.purchase_price ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-600'
                    }`}
                  />
                </div>
                {errors.purchase_price && <span className="text-[11px] text-rose-500">{errors.purchase_price}</span>}
              </div>

              {/* Harga Jual */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Harga Jual
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-blue-600 text-xs">Rp</span>
                  <input
                    type="number"
                    required
                    value={formData.selling_price}
                    onChange={(e) => handleInputChange('selling_price', e.target.value)}
                    className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 font-mono font-bold text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                      errors.selling_price ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-600'
                    }`}
                  />
                </div>
                {errors.selling_price && <span className="text-[11px] text-rose-500">{errors.selling_price}</span>}
              </div>

              {/* Stok Display */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Stok Display</label>
                <input
                  type="number"
                  min="0"
                  value={formData.display_stock}
                  onChange={(e) => handleInputChange('display_stock', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Stok Fisik */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">
                  Stok Fisik
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.physical_stock}
                  onChange={(e) => handleInputChange('physical_stock', e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 font-mono text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all ${
                    errors.physical_stock ? 'border-rose-300 focus:border-rose-500' : 'border-slate-200 focus:border-blue-600'
                  }`}
                />
                {errors.physical_stock && <span className="text-[11px] text-rose-500">{errors.physical_stock}</span>}
              </div>

            </div>
          </div>

          {/* SECTION 5: STATUS & FOTO */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <ImageIcon className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Status & Foto</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Status Inventaris */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Status Inventaris</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="TERSEDIA">Tersedia</option>
                  <option value="HABIS">Habis</option>
                  <option value="BOOKED">Dipesan (Booked)</option>
                  <option value="NONAKTIF">Nonaktif</option>
                </select>
              </div>

              {/* URL Foto Utama */}
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">URL Foto Utama (Opsional)</label>
                <input
                  type="url"
                  value={formData.primary_image.startsWith('data:') ? '' : formData.primary_image}
                  onChange={(e) => {
                    const val = e.target.value;
                    handleInputChange('primary_image', val);
                    setPreviewImage(val);
                    if (val) {
                      setImageFileName('foto-web.jpg');
                      setImageFileSize('Online URL');
                    } else {
                      setImageFileName('');
                      setImageFileSize('');
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

            </div>

            {/* Modern Upload Box Area */}
            <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100/70 text-blue-600 flex items-center justify-center flex-shrink-0">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Upload Foto Laptop</h4>
                  <p className="text-[11px] text-slate-500">PNG, JPG, JPEG maksimal 5MB</p>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Pilih File
                </button>
              </div>
            </div>

            {/* Uploaded / Selected Image Preview */}
            {previewImage && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0">
                    <img
                      src={previewImage}
                      alt="Preview Laptop"
                      className="w-full h-full object-cover"
                      onError={() => setPreviewImage('')}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-800 truncate block">
                      {imageFileName || 'zenbook-s-13-oled.jpg'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {imageFileSize || '1.2 MB'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer flex-shrink-0"
                  title="Hapus Foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>

          {/* SECTION 6: CATATAN TAMBAHAN */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-3">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Catatan</h2>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-700">Catatan Tambahan (Opsional)</label>
              <textarea
                rows={3}
                maxLength={255}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
              <div className="text-right text-[11px] text-slate-400 font-mono">
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
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
              </button>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
};

export default AdminLaptopEditPage;

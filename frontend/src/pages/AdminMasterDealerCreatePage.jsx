import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Building2,
  ChevronRight,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Lock,
  Phone,
  MapPin,
  FileText,
  Laptop
} from 'lucide-react';

const AdminMasterDealerCreatePage = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contact: '',
    address: '',
    status: 'AKTIF',
    notes: ''
  });

  // UI State
  const [loadingCode, setLoadingCode] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    generateNextCode();
  }, []);

  const generateNextCode = async () => {
    setLoadingCode(true);
    try {
      const res = await api.get('/master-dealers');
      if (res.data?.success) {
        const list = res.data.data || [];
        const nextNum = (list.length + 1).toString().padStart(3, '0');
        const autoCode = `MD-${nextNum}`;
        setFormData(prev => ({
          ...prev,
          code: autoCode
        }));
      } else {
        setFormData(prev => ({ ...prev, code: 'MD-004' }));
      }
    } catch (err) {
      console.error('Fetch master dealers for code error:', err);
      setFormData(prev => ({ ...prev, code: 'MD-004' }));
    } finally {
      setLoadingCode(false);
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

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama Master Dealer wajib diisi';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast('Mohon lengkapi field wajib (*)', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        contact: formData.contact.trim() || null,
        address: formData.address.trim() || null,
        status: formData.status,
        notes: formData.notes.trim() || 'Supplier Laptop Baru All Brand'
      };

      const res = await api.post('/master-dealers', payload);
      if (res.data?.success) {
        showToast('Master Dealer berhasil ditambahkan.', 'success');
        setTimeout(() => {
          navigate('/admin/master-data?tab=master-dealers');
        }, 1000);
      }
    } catch (err) {
      console.error('Create master dealer error:', err);
      showToast(err.response?.data?.message || 'Gagal menambahkan Master Dealer. Silakan coba lagi.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
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
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/admin/master-data?tab=master-dealers" className="hover:text-blue-600 transition-colors">Master Data</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/admin/master-data?tab=master-dealers" className="hover:text-blue-600 transition-colors">Master Dealer</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-semibold">Tambah Master Dealer</span>
        </nav>

        {/* Title Bar & Top Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tambah Master Dealer Baru
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tambahkan supplier atau distributor mitra pengadaan laptop baru ke dalam sistem.
            </p>
          </div>

          <Link
            to="/admin/master-data?tab=master-dealers"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Kembali ke Daftar Master Dealer</span>
          </Link>
        </div>
      </div>

      {/* ========================================================
          2. TWO-COLUMN LAYOUT: FORM UTAMA & LIVE PREVIEW
          ======================================================== */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7 COLS): FORM UTAMA */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
            
            {/* Card Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-slate-900">Informasi Master Dealer</h2>
            </div>

            {/* 1. KODE MASTER DEALER */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-slate-700">Kode Master Dealer</label>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-400" /> Dibuat Otomatis
                </span>
              </div>
              <input
                type="text"
                readOnly
                value={formData.code}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 font-mono font-bold text-xs cursor-not-allowed select-none"
              />
            </div>

            {/* 2. NAMA MASTER DEALER */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-700">
                Nama Master Dealer
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                  errors.name ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.name && <span className="text-[11px] text-rose-500 font-medium block">{errors.name}</span>}
            </div>

            {/* 3. KONTAK / NO TELEPON / WHATSAPP */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-700">Nomor Telepon / WhatsApp</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.contact}
                  onChange={(e) => handleInputChange('contact', e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* 4. ALAMAT LENGKAP */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-700">Alamat Kantor / Gudang</label>
              <div className="relative">
                <textarea
                  rows={3}
                  maxLength={255}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>
            </div>

            {/* 5. STATUS OPERASIONAL */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-700">Status Operasional</label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
              >
                <option value="AKTIF">Aktif</option>
                <option value="NONAKTIF">Tidak Aktif</option>
              </select>
            </div>

            {/* 6. CATATAN / KETERANGAN */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-700">Catatan / Keterangan</label>
              <textarea
                rows={3}
                maxLength={255}
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
              <div className="text-right text-[11px] text-slate-400 font-mono">
                {formData.notes.length} / 255
              </div>
            </div>

            {/* Bottom Action Buttons inside card (aligned right) */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate('/admin/master-data?tab=master-dealers')}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting || !formData.name.trim()}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? 'Menyimpan...' : 'Simpan Master Dealer'}</span>
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN (5 COLS): RINGKASAN MASTER DEALER */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 sticky top-6">
            
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ringkasan Master Dealer</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span>Supplier Resmi</span>
              </span>
            </div>

            {/* Dark Receipt-style Summary Details */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-4 shadow-inner">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Kode Distributor</span>
                  <span className="font-mono text-xs font-bold text-blue-400">{formData.code || 'MD-XXX'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
                  <span className={`font-mono text-xs font-bold ${formData.status === 'AKTIF' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {formData.status === 'AKTIF' ? 'Aktif' : 'Non-Aktif'}
                  </span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Nama Master Dealer</span>
                <span className="font-bold text-slate-100 block text-sm leading-tight">
                  {formData.name.trim() || 'Belum diisi'}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Kontak / Telepon</span>
                  <span className="font-mono text-slate-200">{formData.contact.trim() || '-'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Alamat Gudang / Kantor</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {formData.address.trim() || '-'}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
};

export default AdminMasterDealerCreatePage;

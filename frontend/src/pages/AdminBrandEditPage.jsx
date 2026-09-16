import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import {
  Tag,
  ChevronRight,
  Save,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  Lock,
  RefreshCw
} from 'lucide-react';

const AdminBrandEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    status: 'AKTIF'
  });

  // UI State
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [laptopCount, setLaptopCount] = useState(0);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetchBrandDetail();
  }, [id]);

  const fetchBrandDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/brands/${id}`);
      if (res.data?.success) {
        const item = res.data.data;
        setFormData({
          code: item.code || '',
          name: item.name || '',
          description: item.description || `Merek laptop ${item.name || ''}`,
          status: item.status || 'AKTIF'
        });
        setLaptopCount(item.laptop_count || 0);
      }
    } catch (err) {
      console.error('Fetch brand detail error:', err);
      showToast('Gagal memuat data merek.', 'error');
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

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama merek wajib diisi';
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
        description: formData.description.trim(),
        status: formData.status
      };

      const res = await api.put(`/brands/${id}`, payload);
      if (res.data?.success) {
        showToast('Data merek berhasil diperbarui!', 'success');
        setTimeout(() => {
          navigate('/admin/master-data?tab=brands');
        }, 1000);
      }
    } catch (err) {
      console.error('Update brand error:', err);
      showToast(err.response?.data?.message || 'Gagal menyimpan perubahan data merek.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-4 bg-slate-200 rounded w-48 animate-pulse" />
        <div className="h-8 bg-slate-200 rounded w-64 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 h-96 bg-slate-100 rounded-2xl animate-pulse" />
          <div className="lg:col-span-5 h-96 bg-slate-100 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

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
          <Link to="/admin/master-data?tab=brands" className="hover:text-blue-600 transition-colors">Master Data</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/admin/master-data?tab=brands" className="hover:text-blue-600 transition-colors">Merek</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-semibold">Edit Merek</span>
        </nav>

        {/* Title Bar & Top Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Edit Merek: {formData.name || 'Merek'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Perbarui informasi merek laptop ke dalam sistem.
            </p>
          </div>
          <Link
            to="/admin/master-data?tab=brands"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Kembali ke Daftar Merek</span>
          </Link>
        </div>
      </div>

      {/* ========================================================
          2. FORM UTAMA
          ======================================================== */}
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
          
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <Tag className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-slate-900">Informasi Identitas Merek</h2>
          </div>

          {/* 1. KODE MEREK */}
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <label className="block font-semibold text-slate-700">Kode Merek</label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> Readonly
              </span>
            </div>
            <input
              type="text"
              readOnly
              value={formData.code}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100/80 border border-slate-200 text-slate-600 font-mono font-bold text-xs cursor-not-allowed select-none"
            />
          </div>

          {/* 2. NAMA MEREK */}
          <div className="space-y-1.5 text-xs">
            <label className="block font-semibold text-slate-700">
              Nama Merek
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: ASUS, Lenovo, HP, Dell, Apple, Acer"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all ${
                errors.name ? 'border-rose-300' : 'border-slate-200'
              }`}
            />
            {errors.name && <span className="text-[11px] text-rose-500">{errors.name}</span>}
          </div>

          {/* 3. DESKRIPSI */}
          <div className="space-y-1.5 text-xs">
            <label className="block font-semibold text-slate-700">Deskripsi Merek</label>
            <textarea
              rows={4}
              maxLength={255}
              placeholder="Tulis deskripsi atau profil singkat merek ini..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
            <div className="text-right text-[11px] text-slate-400 font-mono">
              {formData.description.length} / 255
            </div>
          </div>

          {/* 4. STATUS OPERASIONAL */}
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

          {/* Form Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => navigate('/admin/master-data?tab=brands')}
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
              <span>{submitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>

        </div>

      </form>

    </div>
  );
};

export default AdminBrandEditPage;

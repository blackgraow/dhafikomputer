import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import {
  Tag,
  Layers,
  Building2,
  Store,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  ChevronLeft,
  Sparkles,
  ExternalLink,
  Laptop,
  Check
} from 'lucide-react';

const AdminMasterDataPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');

  // Active Tab state
  const [activeTab, setActiveTab] = useState('BRANDS'); // 'BRANDS', 'CATEGORIES', 'MASTER_DEALERS', 'DEALERS'
  
  // Data lists
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterDealers, setMasterDealers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name_asc'); // 'name_asc', 'name_desc', 'units_desc', 'units_asc'
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL', 'AKTIF', 'NONAKTIF'
  const [viewMode, setViewMode] = useState('table'); // 'table', 'grid'
  
  // Modals & UI feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
  const [toast, setToast] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    logo_url: '',
    contact_phone: '',
    address: '',
    notes: '',
    status: 'AKTIF',
    is_active: true
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync tab with URL
  useEffect(() => {
    if (tabParam === 'categories') setActiveTab('CATEGORIES');
    else if (tabParam === 'master-dealers') setActiveTab('MASTER_DEALERS');
    else if (tabParam === 'dealers') setActiveTab('DEALERS');
    else setActiveTab('BRANDS');
  }, [tabParam]);

  useEffect(() => {
    fetchAllMasterData();
  }, []);

  const fetchAllMasterData = async () => {
    setLoading(true);
    try {
      const [resB, resC, resMD, resD] = await Promise.all([
        api.get('/brands'),
        api.get('/categories'),
        api.get('/master-dealers'),
        api.get('/dealers')
      ]);
      if (resB.data?.success) setBrands(resB.data.data || []);
      if (resC.data?.success) setCategories(resC.data.data || []);
      if (resMD.data?.success) setMasterDealers(resMD.data.data || []);
      if (resD.data?.success) setDealers(resD.data.data || []);
    } catch (err) {
      console.error('Fetch master data error:', err);
      showToast('Gagal memuat data master.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearch('');
    const tabSlug = key === 'BRANDS' ? 'brands' : key === 'CATEGORIES' ? 'categories' : key === 'MASTER_DEALERS' ? 'master-dealers' : 'dealers';
    setSearchParams({ tab: tabSlug });
  };

  const getActiveList = useMemo(() => {
    let list = [];
    if (activeTab === 'BRANDS') list = brands;
    else if (activeTab === 'CATEGORIES') list = categories;
    else if (activeTab === 'MASTER_DEALERS') list = masterDealers;
    else if (activeTab === 'DEALERS') list = dealers;

    // Filter Search
    let filtered = list;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(item => 
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }

    // Filter Status
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(item => (item.status || 'AKTIF').toUpperCase() === filterStatus);
    }

    // Sort list
    return [...filtered].sort((a, b) => {
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'name_desc') return (b.name || '').localeCompare(a.name || '');
      if (sortBy === 'units_desc') return (b.laptop_count || 0) - (a.laptop_count || 0);
      if (sortBy === 'units_asc') return (a.laptop_count || 0) - (b.laptop_count || 0);
      return 0;
    });
  }, [activeTab, brands, categories, masterDealers, dealers, search, filterStatus, sortBy]);

  const handleOpenAddModal = () => {
    if (activeTab === 'BRANDS') {
      navigate('/admin/master-data/brands/create');
      return;
    }
    if (activeTab === 'CATEGORIES') {
      navigate('/admin/master-data/categories/create');
      return;
    }
    if (activeTab === 'MASTER_DEALERS') {
      navigate('/admin/master-data/master-dealers/create');
      return;
    }
    if (activeTab === 'DEALERS') {
      navigate('/admin/master-data/dealers/create');
      return;
    }

    setEditingItem(null);
  };

  const handleOpenEdit = (item) => {
    if (activeTab === 'BRANDS') {
      navigate(`/admin/master-data/brands/${item.id}/edit`);
    } else if (activeTab === 'CATEGORIES') {
      navigate(`/admin/master-data/categories/${item.id}/edit`);
    } else if (activeTab === 'MASTER_DEALERS') {
      navigate(`/admin/master-data/master-dealers/${item.id}/edit`);
    } else if (activeTab === 'DEALERS') {
      navigate(`/admin/master-data/dealers/${item.id}/edit`);
    } else {
      handleOpenEditModal(item);
    }
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      code: item.code || '',
      name: item.name || '',
      description: item.description || '',
      logo_url: item.logo_url || '',
      contact_phone: item.contact_phone || '',
      address: item.address || '',
      notes: item.notes || '',
      status: item.status || 'AKTIF',
      is_active: item.is_active !== undefined ? item.is_active : true
    });
    setIsModalOpen(true);
  };

  const getEndpoint = () => {
    if (activeTab === 'BRANDS') return '/brands';
    if (activeTab === 'CATEGORIES') return '/categories';
    if (activeTab === 'MASTER_DEALERS') return '/master-dealers';
    return '/dealers';
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = getEndpoint();
      if (editingItem) {
        const res = await api.put(`${endpoint}/${editingItem.id}`, formData);
        if (res.data.success) {
          showToast(`Data ${activeTab === 'BRANDS' ? 'Merek' : 'Master'} berhasil diperbarui.`);
          setIsModalOpen(false);
          fetchAllMasterData();
        }
      } else {
        const res = await api.post(endpoint, formData);
        if (res.data.success) {
          showToast(`Data ${activeTab === 'BRANDS' ? 'Merek' : 'Master'} berhasil ditambahkan.`);
          setIsModalOpen(false);
          fetchAllMasterData();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menyimpan data master.', 'error');
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteConfirmItem) return;
    try {
      const endpoint = getEndpoint();
      const res = await api.delete(`${endpoint}/${deleteConfirmItem.id}`);
      if (res.data.success) {
        showToast(`Data ${deleteConfirmItem.name} berhasil dihapus.`);
        setDeleteConfirmItem(null);
        fetchAllMasterData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Gagal menghapus data. Pastikan tidak ada unit laptop yang terhubung.', 'error');
    }
  };

  const currentTabTitle = activeTab === 'BRANDS' 
    ? 'Master Merek' 
    : activeTab === 'CATEGORIES' 
    ? 'Master Kategori' 
    : activeTab === 'MASTER_DEALERS' 
    ? 'Master Dealer' 
    : 'Dealer Toko Lain';

  const currentTabSubtitle = activeTab === 'BRANDS'
    ? 'Kelola semua data merek laptop yang tersedia pada sistem.'
    : activeTab === 'CATEGORIES'
    ? 'Kelola kategori dan segmentasi laptop pada inventaris.'
    : activeTab === 'MASTER_DEALERS'
    ? 'Kelola data supplier & distributor resmi pengadaan laptop baru.'
    : 'Kelola data toko rekanan dan sumber pengadaan laptop second.';

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
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/admin/master-data" className="hover:text-blue-600 transition-colors">Master Data</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-semibold">
            {activeTab === 'BRANDS' ? 'Merek' : activeTab === 'CATEGORIES' ? 'Kategori' : activeTab === 'MASTER_DEALERS' ? 'Master Dealer' : 'Dealer'}
          </span>
        </nav>

        {/* Title Bar & Top Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentTabTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {currentTabSubtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah {activeTab === 'BRANDS' ? 'Merek' : activeTab === 'CATEGORIES' ? 'Kategori' : activeTab === 'MASTER_DEALERS' ? 'Master Dealer' : 'Dealer'}</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. SEARCH & TOOLBAR CONTAINER
          ======================================================== */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search Box */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              activeTab === 'BRANDS' 
                ? 'Cari merek laptop...' 
                : activeTab === 'CATEGORIES' 
                ? 'Cari kategori laptop...' 
                : 'Cari data master...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
          
          {/* Status Filter Dropdown */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-8 pr-7 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 focus:outline-none focus:border-blue-600 cursor-pointer transition-all appearance-none"
            >
              <option value="ALL">Semua Status</option>
              <option value="AKTIF">Status: Aktif</option>
              <option value="NONAKTIF">Status: Nonaktif</option>
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-8 pr-7 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 focus:outline-none focus:border-blue-600 cursor-pointer transition-all appearance-none"
            >
              <option value="name_asc">Nama (A - Z)</option>
              <option value="name_desc">Nama (Z - A)</option>
              <option value="units_desc">Unit Terbanyak</option>
              <option value="units_asc">Unit Paling Sedikit</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Tampilan Tabel"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Tampilan Grid Card"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================
          4. MAIN DATA TABLE / GRID CONTAINER
          ======================================================== */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-5 font-semibold">KODE</th>
                  <th className="py-3.5 px-5 font-semibold">
                    {activeTab === 'BRANDS' ? 'NAMA MEREK' : 'NAMA'}
                  </th>
                  {(activeTab === 'MASTER_DEALERS' || activeTab === 'DEALERS') ? (
                    <>
                      <th className="py-3.5 px-5 font-semibold">KONTAK</th>
                      <th className="py-3.5 px-5 font-semibold">ALAMAT</th>
                    </>
                  ) : (
                    <th className="py-3.5 px-5 font-semibold">DESKRIPSI</th>
                  )}
                  <th className="py-3.5 px-5 font-semibold text-center">
                    {activeTab === 'BRANDS' ? 'JUMLAH LAPTOP' : 'TERKAIT'}
                  </th>
                  <th className="py-3.5 px-5 font-semibold text-center">STATUS</th>
                  <th className="py-3.5 px-5 font-semibold text-right">AKSI</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  [1, 2, 3, 4, 5].map((n) => (
                    <tr key={n} className="animate-pulse">
                      <td className="py-4 px-5"><div className="h-4 bg-slate-200 rounded w-20" /></td>
                      <td className="py-4 px-5"><div className="h-4 bg-slate-200 rounded w-36" /></td>
                      <td className="py-4 px-5"><div className="h-4 bg-slate-100 rounded w-48" /></td>
                      <td className="py-4 px-5 text-center"><div className="h-4 bg-slate-100 rounded w-16 mx-auto" /></td>
                      <td className="py-4 px-5 text-center"><div className="h-5 bg-slate-100 rounded-full w-16 mx-auto" /></td>
                      <td className="py-4 px-5 text-right"><div className="h-6 bg-slate-100 rounded w-16 ml-auto" /></td>
                    </tr>
                  ))
                ) : getActiveList.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Tag className="w-8 h-8 text-slate-300 stroke-1" />
                        <p className="font-medium text-slate-600">Tidak ada data ditemukan</p>
                        <p className="text-[11px] text-slate-400">Coba ubah kata kunci pencarian atau filter yang dipilih.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  getActiveList.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* KODE */}
                      <td className="py-4 px-5 font-mono font-bold text-slate-900 text-xs">
                        {item.code}
                      </td>

                      {/* NAMA MEREK / ITEM */}
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </span>
                      </td>

                      {/* DESKRIPSI / KONTAK & ALAMAT */}
                      {(activeTab === 'MASTER_DEALERS' || activeTab === 'DEALERS') ? (
                        <>
                          <td className="py-4 px-5 font-mono text-slate-600">
                            {item.contact_phone || item.contact || '-'}
                          </td>
                          <td className="py-4 px-5 text-slate-500 truncate max-w-xs">
                            {item.address || '-'}
                          </td>
                        </>
                      ) : (
                        <td className="py-4 px-5 text-slate-500 text-xs">
                          {item.description || `Merek laptop ${item.name}`}
                        </td>
                      )}

                      {/* JUMLAH LAPTOP / TERKAIT */}
                      <td className="py-4 px-5 text-center">
                        <Link 
                          to={activeTab === 'BRANDS' ? `/admin/laptops?search=${encodeURIComponent(item.name)}` : '/admin/laptops'}
                          className="inline-block font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors font-mono"
                        >
                          {item.laptop_count ?? item.total_laptops ?? 0} Unit
                        </Link>
                      </td>

                      {/* STATUS */}
                      <td className="py-4 px-5 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Aktif</span>
                        </span>
                      </td>

                      {/* AKSI */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmItem(item)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination Info */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50/50">
            <div>
              Menampilkan <span className="font-semibold text-slate-700">{getActiveList.length > 0 ? 1 : 0}</span> sampai <span className="font-semibold text-slate-700">{getActiveList.length}</span> dari <span className="font-semibold text-slate-700">{getActiveList.length}</span> data
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled
                className="p-1.5 rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                className="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-xs"
              >
                1
              </button>
              <button
                disabled
                className="p-1.5 rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      ) : (
        /* GRID VIEW MODE */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {getActiveList.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 space-y-4 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-slate-500">{item.code}</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ● Aktif
                  </span>
                </div>

                <div className="py-3">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                    {item.description || `Merek laptop ${item.name}`}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link
                  to={activeTab === 'BRANDS' ? `/admin/laptops?search=${encodeURIComponent(item.name)}` : '/admin/laptops'}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 font-mono"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>{item.laptop_count ?? 0} Unit</span>
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmItem(item)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================
          5. TAMBAH / EDIT MODAL
          ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Tag className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {editingItem 
                    ? `Edit ${activeTab === 'BRANDS' ? 'Merek' : 'Data Master'}` 
                    : `Tambah ${activeTab === 'BRANDS' ? 'Merek Baru' : 'Data Master Baru'}`
                  }
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Kode */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-semibold">
                  Kode {activeTab === 'BRANDS' ? 'Merek' : 'Data'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BRD-ASUS"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono font-bold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Nama */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-semibold">
                  Nama {activeTab === 'BRANDS' ? 'Merek' : 'Data'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ASUS / Acer / Lenovo"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* Logo URL for Brands */}
              {activeTab === 'BRANDS' && (
                <div className="space-y-1.5">
                  <label className="block text-slate-700 font-semibold">Tautan URL Logo (Opsional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png atau .svg"
                    value={formData.logo_url}
                    onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <p className="text-[11px] text-slate-400">
                    Bisa berupa link URL langsung atau diedit lebih lanjut dengan upload file di halaman Edit Merek.
                  </p>
                </div>
              )}

              {/* Deskripsi */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-semibold">Deskripsi</label>
                <textarea
                  rows="3"
                  placeholder="Deskripsi atau catatan tentang merek/data ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                />
              </div>

              {/* Conditional Fields for Dealers */}
              {(activeTab === 'MASTER_DEALERS' || activeTab === 'DEALERS') && (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-semibold">Kontak WhatsApp / Telp</label>
                    <input
                      type="text"
                      placeholder="081234567890"
                      value={formData.contact_phone}
                      onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-slate-700 font-semibold">Alamat</label>
                    <textarea
                      rows="2"
                      placeholder="Alamat lengkap toko / distributor..."
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    />
                  </div>
                </>
              )}

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-semibold">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option value="AKTIF">Aktif</option>
                  <option value="NONAKTIF">Nonaktif</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          6. DELETE CONFIRMATION MODAL
          ======================================================== */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Data Master?</h3>
                <p className="text-xs text-slate-500">Aksi ini tidak dapat dibatalkan</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              Apakah Anda yakin ingin menghapus <strong>{deleteConfirmItem.name}</strong> ({deleteConfirmItem.code})? Aksi ini akan diblokir oleh sistem jika masih terdapat laptop yang terhubung ke merek/data ini.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteItem}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md shadow-red-600/20 transition-all cursor-pointer"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminMasterDataPage;

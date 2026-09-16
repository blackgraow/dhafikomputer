import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  ArrowUpRight,
  ChevronRight,
  Save,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Store,
  User,
  Calendar,
  Receipt,
  FileText,
  Laptop,
  History,
  TrendingDown,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';

const AdminTransactionOutPage = () => {
  const navigate = useNavigate();

  // Reference Data
  const [laptops, setLaptops] = useState([]);
  const [dealers, setDealers] = useState([]);

  // UI State
  const [loadingData, setLoadingData] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [transactionCode] = useState(`TRX-OUT-${Date.now().toString().slice(-6)}`);
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [destinationType, setDestinationType] = useState('CUSTOMER'); // 'CUSTOMER', 'DEALER', 'INTERNAL'
  const [selectedDealerId, setSelectedDealerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [internalPurpose, setInternalPurpose] = useState('Unit Demo Display Toko');
  const [referenceDoc, setReferenceDoc] = useState('');
  const [notes, setNotes] = useState('');

  // Multi-Item Rows State
  const [items, setItems] = useState([
    { laptop_id: '', quantity: 1, unit_price: 0 }
  ]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoadingData(true);
    try {
      const [resLaptops, resD] = await Promise.all([
        api.get('/laptops', { params: { limit: 100 } }),
        api.get('/dealers')
      ]);

      if (resLaptops.data?.success) {
        setLaptops(resLaptops.data.data || []);
      }
      if (resD.data?.success) {
        const dList = resD.data.data || [];
        setDealers(dList);
        if (dList.length > 0) setSelectedDealerId(dList[0].id.toString());
      }
    } catch (err) {
      console.error('Error loading initial data for transaction out:', err);
      showToast('Gagal memuat data referensi.', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  // Item Row Handlers
  const handleAddItemRow = () => {
    setItems(prev => [...prev, { laptop_id: '', quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (items.length <= 1) {
      showToast('Minimal harus ada 1 item laptop.', 'error');
      return;
    }
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const copy = [...prev];
      if (field === 'laptop_id') {
        const laptopIdNum = parseInt(value, 10);
        copy[index].laptop_id = value;
        const selectedLap = laptops.find(l => l.id === laptopIdNum);
        if (selectedLap) {
          copy[index].unit_price = Number(selectedLap.selling_price) || 0;
        } else {
          copy[index].unit_price = 0;
        }
      } else if (field === 'quantity') {
        const val = parseInt(value, 10);
        copy[index].quantity = isNaN(val) ? '' : Math.max(1, val);
      } else if (field === 'unit_price') {
        const val = parseFloat(value);
        copy[index].unit_price = isNaN(val) ? '' : Math.max(0, val);
      }
      return copy;
    });
  };

  // Calculations
  const totalQuantity = items.reduce((sum, item) => sum + (parseInt(item.quantity, 10) || 0), 0);
  const totalAmount = items.reduce((sum, item) => {
    const qty = parseInt(item.quantity, 10) || 0;
    const price = parseFloat(item.unit_price) || 0;
    return sum + (qty * price);
  }, 0);

  // Stock check helper
  const isStockSufficient = items.every(it => {
    if (!it.laptop_id) return true;
    const lap = laptops.find(l => l.id === parseInt(it.laptop_id, 10));
    if (!lap) return true;
    const qty = parseInt(it.quantity, 10) || 0;
    return (lap.physical_stock || 0) >= qty && qty > 0;
  });

  // Destination Name Resolver
  const getDestinationName = () => {
    if (destinationType === 'CUSTOMER') {
      return customerName.trim() ? `${customerName.trim()} (Customer Walk-in / Online)` : 'Penjualan Customer';
    }
    if (destinationType === 'DEALER') {
      const found = dealers.find(d => d.id === parseInt(selectedDealerId, 10));
      return found ? `${found.name} (Mitra Toko / Reseller)` : 'Dealer Toko Lain';
    }
    return internalPurpose ? `Keperluan Internal (${internalPurpose})` : 'Keperluan Operasional Internal';
  };

  // Validation
  const isFormValid = Boolean(
    items.length > 0 &&
    items.every(item => item.laptop_id && parseInt(item.quantity, 10) > 0 && item.unit_price !== '' && !isNaN(item.unit_price) && Number(item.unit_price) >= 0) &&
    isStockSufficient &&
    (destinationType === 'CUSTOMER' ? Boolean(customerName.trim()) : true) &&
    (destinationType === 'DEALER' ? Boolean(selectedDealerId) : true) &&
    (destinationType === 'INTERNAL' ? Boolean(internalPurpose) : true)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      if (!isStockSufficient) {
        showToast('Terdapat kuantitas barang keluar yang melebihi stok fisik laptop tersedia!', 'error');
      } else {
        showToast('Mohon lengkapi seluruh informasi barang keluar dengan benar.', 'error');
      }
      return;
    }

    setSubmitting(true);
    try {
      const formattedItems = items.map(it => ({
        laptop_id: parseInt(it.laptop_id, 10),
        quantity: parseInt(it.quantity, 10),
        unit_price: parseFloat(it.unit_price) || 0
      }));

      const sourceDestinationText = getDestinationName();
      const finalNotes = [
        referenceDoc.trim() ? `No. Nota/Faktur: ${referenceDoc.trim()}` : null,
        customerPhone.trim() && destinationType === 'CUSTOMER' ? `Telp: ${customerPhone.trim()}` : null,
        customerAddress.trim() && destinationType === 'CUSTOMER' ? `Alamat: ${customerAddress.trim()}` : null,
        notes.trim() ? notes.trim() : null
      ].filter(Boolean).join(' | ');

      const payload = {
        source_destination: sourceDestinationText,
        notes: finalNotes || 'Penjualan / Pengeluaran Unit Laptop',
        items: formattedItems
      };

      const res = await api.post('/transactions/out', payload);
      if (res.data?.success) {
        showToast('Transaksi Barang Keluar berhasil diproses! Stok fisik telah dikurangi.', 'success');
        
        // Reset form
        setItems([{ laptop_id: '', quantity: 1, unit_price: 0 }]);
        setReferenceDoc('');
        setNotes('');
        if (destinationType === 'CUSTOMER') {
          setCustomerName('');
          setCustomerPhone('');
          setCustomerAddress('');
        }

        // Reload data
        loadInitialData();
      }
    } catch (err) {
      console.error('Submit transaction out error:', err);
      showToast(err.response?.data?.message || 'Gagal memproses transaksi barang keluar.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-200 ${
          toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
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
          <Link to="/admin/transactions" className="hover:text-blue-600 transition-colors">Transaksi</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-semibold">Barang Keluar</span>
        </nav>

        {/* Title Bar & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                <ArrowUpRight className="w-5 h-5 stroke-2" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Transaksi Barang Keluar
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Catat penjualan atau pengeluaran unit laptop dan kurangi stok inventaris.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/admin/transactions?tab=history"
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <History className="w-4 h-4 text-slate-500" />
              <span>Riwayat Transaksi</span>
            </Link>
            <Link
              to="/admin/laptops"
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Laptop className="w-4 h-4 text-slate-500" />
              <span>Data Laptop</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. TWO-COLUMN LAYOUT: FORM UTAMA & LIVE RECEIPT PREVIEW
          ======================================================== */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (7 COLS): FORM PENGELUARAN */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Identitas & Tujuan Pengeluaran */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Identitas & Tujuan Pengeluaran</h2>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {transactionCode}
              </span>
            </div>

            {/* Tanggal & No Referensi Dokumen */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">Tanggal Pengeluaran / Penjualan</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="date"
                    required
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block font-semibold text-slate-700">No. Nota / Faktur Penjualan</label>
                <input
                  type="text"
                  placeholder="Contoh: NOTA-2024/09/001 atau INV-8891"
                  value={referenceDoc}
                  onChange={(e) => setReferenceDoc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-mono"
                />
              </div>
            </div>

            {/* Selector Jenis Tujuan Pengeluaran */}
            <div className="space-y-2 pt-2">
              <label className="block font-semibold text-slate-700 text-xs">
                Pilih Kategori Tujuan Pengeluaran
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                
                {/* 1. Customer */}
                <button
                  type="button"
                  onClick={() => setDestinationType('CUSTOMER')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    destinationType === 'CUSTOMER'
                      ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-xs ring-2 ring-blue-100'
                      : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <User className={`w-4 h-4 ${destinationType === 'CUSTOMER' ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="font-bold">Customer</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Penjualan Retail / Pembeli</span>
                </button>

                {/* 2. Dealer Toko Lain */}
                <button
                  type="button"
                  onClick={() => setDestinationType('DEALER')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    destinationType === 'DEALER'
                      ? 'bg-indigo-50/80 border-indigo-500 text-indigo-900 shadow-xs ring-2 ring-indigo-100'
                      : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Store className={`w-4 h-4 ${destinationType === 'DEALER' ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="font-bold">Dealer / Toko</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Wholesale / Rekanan Toko</span>
                </button>

                {/* 3. Operasional Internal */}
                <button
                  type="button"
                  onClick={() => setDestinationType('INTERNAL')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    destinationType === 'INTERNAL'
                      ? 'bg-amber-50/80 border-amber-500 text-amber-900 shadow-xs ring-2 ring-amber-100'
                      : 'bg-slate-50/80 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <FileText className={`w-4 h-4 ${destinationType === 'INTERNAL' ? 'text-amber-600' : 'text-slate-400'}`} />
                    <span className="font-bold">Internal / Demo</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-tight">Demo / Garansi / Operasional</span>
                </button>

              </div>
            </div>

            {/* Dynamic Sub-form Tujuan */}
            {destinationType === 'CUSTOMER' && (
              <div className="p-4 rounded-xl bg-blue-50/40 border border-blue-100 space-y-3 text-xs">
                <span className="font-bold text-blue-900 block text-[11px] uppercase tracking-wider">
                  Informasi Pembeli / Customer
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">Nama Customer / Pembeli</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bpk. Ahmad R."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700">No. Telepon / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="Contoh: 0812-3456-7890"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Alamat Pengiriman / Domisili (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Merdeka No. 45, Bandung"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {destinationType === 'DEALER' && (
              <div className="p-4 rounded-xl bg-indigo-50/40 border border-indigo-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700">Pilih Dealer Toko Rekanan *</label>
                  <Link to="/admin/master-data/dealers/create" target="_blank" className="text-[11px] text-indigo-600 hover:underline font-semibold flex items-center gap-1">
                    + Tambah Dealer
                  </Link>
                </div>
                <select
                  required
                  value={selectedDealerId}
                  onChange={(e) => setSelectedDealerId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                >
                  {dealers.map(d => (
                    <option key={d.id} value={d.id}>
                      [{d.code}] {d.name} {d.contact ? `• Telp: ${d.contact}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {destinationType === 'INTERNAL' && (
              <div className="p-4 rounded-xl bg-amber-50/40 border border-amber-100 space-y-2 text-xs">
                <label className="font-semibold text-slate-700 block">Tujuan Pengeluaran Internal</label>
                <select
                  value={internalPurpose}
                  onChange={(e) => setInternalPurpose(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-100 transition-all cursor-pointer"
                >
                  <option value="Unit Demo Display Toko">Unit Demo Display Toko</option>
                  <option value="Penggantian Garansi Unit Rusak (RMA)">Penggantian Garansi Unit Rusak (RMA)</option>
                  <option value="Pemakaian Operasional Kantor">Pemakaian Operasional Kantor</option>
                  <option value="Retur ke Supplier / Vendor">Retur ke Supplier / Vendor</option>
                </select>
              </div>
            )}

          </div>

          {/* Card 2: Daftar Item Laptop Keluar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Daftar Laptop Keluar / Terjual</h2>
                  <span className="text-[11px] text-slate-400">Pilih unit laptop dan kuantitas yang dikeluarkan dari stok</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddItemRow}
                className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Baris</span>
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-3.5">
              {items.map((item, idx) => {
                const selectedLap = laptops.find(l => l.id === parseInt(item.laptop_id, 10));
                const currentPhysical = selectedLap ? (selectedLap.physical_stock || 0) : 0;
                const qtyNum = parseInt(item.quantity, 10) || 0;
                const priceNum = parseFloat(item.unit_price) || 0;
                const subtotal = qtyNum * priceNum;
                const isOverStock = selectedLap && qtyNum > currentPhysical;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      isOverStock
                        ? 'bg-rose-50/60 border-rose-300 ring-2 ring-rose-100'
                        : 'bg-slate-50/70 border-slate-200/90 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-mono">
                          {idx + 1}
                        </span>
                        Item Laptop
                      </span>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(idx)}
                          className="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                          title="Hapus Baris"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                      
                      {/* Select Laptop */}
                      <div className="sm:col-span-6 space-y-1">
                        <label className="font-semibold text-slate-700 block">Pilih Model Laptop</label>
                        <select
                          required
                          value={item.laptop_id}
                          onChange={(e) => handleItemChange(idx, 'laptop_id', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                        >
                          <option value="">-- Pilih Laptop Tersedia --</option>
                          {laptops.map(lap => {
                            const isZero = (lap.physical_stock || 0) <= 0;
                            return (
                              <option key={lap.id} value={lap.id} disabled={isZero}>
                                [{lap.code}] {lap.name} — Stok: {lap.physical_stock || 0} unit {isZero ? '(HABIS)' : ''}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Quantity */}
                      <div className="sm:col-span-2 space-y-1">
                        <label className="font-semibold text-slate-700 block">Qty Keluar</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                          className={`w-full px-2.5 py-2 rounded-xl bg-white border text-slate-900 font-bold font-mono text-center focus:outline-none focus:ring-2 transition-all ${
                            isOverStock
                              ? 'border-rose-400 focus:ring-rose-100 text-rose-700'
                              : 'border-slate-200 focus:ring-blue-100'
                          }`}
                        />
                      </div>

                      {/* Harga Jual Satuan */}
                      <div className="sm:col-span-4 space-y-1">
                        <label className="font-semibold text-slate-700 block">Harga Jual / Unit (Rp)</label>
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                      </div>

                    </div>

                    {/* Overstock Alert or Stock Decrement Simulation */}
                    {selectedLap && (
                      <div className="pt-2 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                        {isOverStock ? (
                          <div className="flex items-center gap-1.5 text-rose-700 font-semibold">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>Stok fisik tidak mencukupi! Hanya tersedia {currentPhysical} unit di gudang.</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-600">
                            <span className="bg-slate-200/80 px-2 py-0.5 rounded font-mono font-semibold text-slate-700">
                              Stok Saat Ini: {currentPhysical} Unit
                            </span>
                            <span className="text-slate-400">➔</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                              Sisa Stok: {currentPhysical - qtyNum} Unit (-{qtyNum})
                            </span>
                          </div>
                        )}

                        <div className="text-slate-800 font-semibold sm:text-right">
                          Subtotal: <span className="font-mono text-blue-700 font-bold">{formatRupiah(subtotal)}</span>
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>

          </div>

          {/* Card 3: Catatan Transaksi */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-3">
            <label className="block font-semibold text-slate-700 text-xs">Catatan Pengeluaran / Keterangan</label>
            <textarea
              rows={3}
              maxLength={255}
              placeholder="Tulis catatan atau keterangan tambahan terkait penjualan/pengeluaran barang ini..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setItems([{ laptop_id: '', quantity: 1, unit_price: 0 }]);
                setNotes('');
                setReferenceDoc('');
              }}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={submitting || !isFormValid}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memproses Transaksi...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Transaksi Barang Keluar</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN (5 COLS): LIVE RECEIPT & PENJUALAN PREVIEW */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5 sticky top-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Receipt className="w-4 h-4" />
                </div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ringkasan Penjualan</h2>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                <span>Stok -</span>
              </span>
            </div>

            {/* Receipt Summary Details */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-4 shadow-inner">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Dokumen</span>
                  <span className="font-mono text-xs font-bold text-blue-400">{transactionCode}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Tanggal</span>
                  <span className="font-mono text-xs text-slate-300">{transactionDate}</span>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tujuan Pengeluaran</span>
                <span className="font-bold text-slate-100 block leading-tight">{getDestinationName()}</span>
              </div>

              {/* Items Breakdown in Receipt */}
              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Rincian Barang Terjual</span>
                
                {items.filter(it => it.laptop_id).length === 0 ? (
                  <p className="text-slate-500 text-[11px] italic">Belum ada item laptop yang dipilih.</p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {items.filter(it => it.laptop_id).map((it, idx) => {
                      const lap = laptops.find(l => l.id === parseInt(it.laptop_id, 10));
                      const qty = parseInt(it.quantity, 10) || 0;
                      const price = parseFloat(it.unit_price) || 0;
                      return (
                        <div key={idx} className="flex items-start justify-between gap-2 text-[11px] pb-1.5 border-b border-slate-800/60 last:border-0">
                          <div className="min-w-0">
                            <span className="font-medium text-slate-200 block truncate">{lap?.name || 'Laptop'}</span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {qty} unit × {formatRupiah(price)}
                            </span>
                          </div>
                          <span className="font-mono font-bold text-slate-100 shrink-0">
                            {formatRupiah(qty * price)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Grand Total */}
              <div className="pt-3 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total Kuantitas</span>
                  <span className="font-mono font-bold text-white">{totalQuantity} Unit</span>
                </div>
                <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-800">
                  <span className="font-bold text-slate-200">Total Nilai Keluar</span>
                  <span className="font-mono font-extrabold text-blue-400 text-base">
                    {formatRupiah(totalAmount)}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </form>

    </div>
  );
};

export default AdminTransactionOutPage;

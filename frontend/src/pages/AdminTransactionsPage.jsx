import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Search,
  Eye,
  X,
  Building2,
  Store,
  User,
  Package,
  Layers,
  Printer,
  Receipt,
  Phone,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

const AdminTransactionsPage = () => {
  const [activeTab, setActiveTab] = useState('MASUK'); // 'MASUK', 'KELUAR', 'RIWAYAT'
  const [laptops, setLaptops] = useState([]);
  const [masterDealers, setMasterDealers] = useState([]);
  const [dealers, setDealers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State for Barang Masuk
  const [sourceType, setSourceType] = useState('MASTER_DEALER');
  const [selectedMD, setSelectedMD] = useState('');
  const [selectedDealer, setSelectedDealer] = useState('');
  const [inCustomerName, setInCustomerName] = useState('');

  // Form State for Barang Keluar
  const [outCustomerName, setOutCustomerName] = useState('');
  const [outCustomerContact, setOutCustomerContact] = useState('');

  // Shared Form State
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { laptop_id: '', quantity: 1, unit_price: 0 }
  ]);

  // Filters for Riwayat
  const [historySearch, setHistorySearch] = useState('');
  const [historyType, setHistoryType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    fetchMetadata();
    fetchLaptops();
  }, []);

  useEffect(() => {
    if (activeTab === 'RIWAYAT') {
      fetchTransactions();
    }
  }, [activeTab, historyType, startDate, endDate]);

  const fetchMetadata = async () => {
    try {
      const [resMD, resD] = await Promise.all([
        api.get('/master-dealers'),
        api.get('/dealers')
      ]);
      if (resMD.data.success) {
        setMasterDealers(resMD.data.data);
        if (resMD.data.data.length > 0) setSelectedMD(resMD.data.data[0].id);
      }
      if (resD.data.success) {
        setDealers(resD.data.data);
        if (resD.data.data.length > 0) setSelectedDealer(resD.data.data[0].id);
      }
    } catch (err) {
      console.error('Fetch transaction metadata error:', err);
    }
  };

  const fetchLaptops = async () => {
    try {
      const res = await api.get('/laptops', { params: { limit: 100 } });
      if (res.data.success) {
        setLaptops(res.data.data);
      }
    } catch (err) {
      console.error('Fetch laptops error:', err);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        search: historySearch || undefined,
        type: historyType || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        limit: 25
      };
      const res = await api.get('/transactions', { params });
      if (res.data.success) {
        setTransactions(res.data.data);
      }
    } catch (err) {
      console.error('Fetch transactions error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItemRow = () => {
    setItems(prev => [...prev, { laptop_id: '', quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItemRow = (index) => {
    if (items.length === 1) return;
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index][field] = value;

      if (field === 'laptop_id') {
        const found = laptops.find(l => l.id === parseInt(value));
        if (found) {
          updated[index].unit_price = activeTab === 'MASUK' ? found.purchase_price : found.selling_price;
        }
      }
      return updated;
    });
  };

  const handleSubmitTransaction = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const invalidItem = items.find(it => !it.laptop_id || parseInt(it.quantity) <= 0);
      if (invalidItem) {
        setError('Pilih laptop dan tentukan jumlah unit yang valid (> 0) untuk setiap baris.');
        setLoading(false);
        return;
      }

      if (activeTab === 'KELUAR') {
        for (const it of items) {
          const l = laptops.find(x => x.id === parseInt(it.laptop_id));
          if (l && parseInt(it.quantity) > l.physical_stock) {
            setError(`Stok tidak mencukupi untuk "${l.name}"! Permintaan: ${it.quantity} Unit, Stok Fisik Tersedia: ${l.physical_stock} Unit.`);
            setLoading(false);
            return;
          }
        }
      }

      let formattedSource = '';
      if (activeTab === 'MASUK') {
        if (sourceType === 'MASTER_DEALER') {
          const md = masterDealers.find(m => m.id === parseInt(selectedMD));
          formattedSource = `Master Dealer: ${md ? md.name : 'MD 1'}`;
        } else if (sourceType === 'DEALER') {
          const d = dealers.find(dl => dl.id === parseInt(selectedDealer));
          formattedSource = `Dealer: ${d ? d.name : 'Toko Partner'}`;
        } else {
          formattedSource = `Customer: ${inCustomerName || 'Customer'}`;
        }
      } else {
        formattedSource = `Customer: ${outCustomerName || 'Pembeli Toko'} ${outCustomerContact ? `(${outCustomerContact})` : ''}`;
      }

      const endpoint = activeTab === 'MASUK' ? '/transactions/in' : '/transactions/out';
      const payload = {
        source_destination: formattedSource,
        notes,
        items: items.map(it => ({
          laptop_id: parseInt(it.laptop_id),
          quantity: parseInt(it.quantity),
          unit_price: parseFloat(it.unit_price || 0)
        }))
      };

      const res = await api.post(endpoint, payload);
      if (res.data.success) {
        setSuccess(res.data.message);
        setInCustomerName('');
        setOutCustomerName('');
        setOutCustomerContact('');
        setNotes('');
        setItems([{ laptop_id: '', quantity: 1, unit_price: 0 }]);
        fetchLaptops();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memproses transaksi.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalQuantity = () => {
    return items.reduce((acc, it) => acc + (parseInt(it.quantity) || 0), 0);
  };

  const calculateTotalAmount = () => {
    return items.reduce((acc, it) => acc + ((parseInt(it.quantity) || 0) * (parseFloat(it.unit_price) || 0)), 0);
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
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transaksi</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola pergerakan stok laptop (Barang Masuk & Barang Keluar).
          </p>
        </div>
      </div>

      {/* Action Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3 text-xs">
        <button
          onClick={() => { setActiveTab('MASUK'); setError(''); setSuccess(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'MASUK'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-soft'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4" />
          <span>+ Barang Masuk (Stok +)</span>
        </button>

        <button
          onClick={() => { setActiveTab('KELUAR'); setError(''); setSuccess(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'KELUAR'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-soft'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>+ Barang Keluar (Stok -)</span>
        </button>

        <button
          onClick={() => { setActiveTab('RIWAYAT'); setError(''); setSuccess(''); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
            activeTab === 'RIWAYAT'
              ? 'bg-slate-100 text-slate-900 border border-slate-300 shadow-soft'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Riwayat Transaksi</span>
        </button>
      </div>

      {/* Feedback alerts */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* TAB 1: FORM BARANG MASUK */}
      {activeTab === 'MASUK' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Form Pengadaan Barang Masuk</h2>
            <p className="text-xs text-slate-500">Mencatat unit laptop yang masuk ke gudang dan menambah stok fisik.</p>
          </div>

          <form onSubmit={handleSubmitTransaction} className="space-y-5 text-xs">
            
            {/* Sumber Pengadaan */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                1. Sumber Pengadaan
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSourceType('MASTER_DEALER')}
                  className={`py-2 rounded-lg border font-semibold text-xs cursor-pointer ${
                    sourceType === 'MASTER_DEALER' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Master Dealer (All Brand)
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType('DEALER')}
                  className={`py-2 rounded-lg border font-semibold text-xs cursor-pointer ${
                    sourceType === 'DEALER' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Dealer (Toko Lain)
                </button>
                <button
                  type="button"
                  onClick={() => setSourceType('CUSTOMER')}
                  className={`py-2 rounded-lg border font-semibold text-xs cursor-pointer ${
                    sourceType === 'CUSTOMER' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  Customer (Trade-in / Buyback)
                </button>
              </div>

              {sourceType === 'MASTER_DEALER' && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Pilih Master Dealer *</label>
                  <select
                    value={selectedMD}
                    onChange={(e) => setSelectedMD(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none"
                  >
                    {masterDealers.map(md => (
                      <option key={md.id} value={md.id}>{md.code} - {md.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {sourceType === 'DEALER' && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Pilih Dealer Partner *</label>
                  <select
                    value={selectedDealer}
                    onChange={(e) => setSelectedDealer(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none"
                  >
                    {dealers.map(d => (
                      <option key={d.id} value={d.id}>{d.code} - {d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {sourceType === 'CUSTOMER' && (
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nama Customer / Pemilik *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Gunawan"
                    value={inCustomerName}
                    onChange={(e) => setInCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Daftar Item Laptop */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                  2. Daftar Laptop Masuk
                </span>
                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-600 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Baris
                </button>
              </div>

              {items.map((item, idx) => {
                const selectedObj = laptops.find(l => l.id === parseInt(item.laptop_id));
                const currentPhysical = selectedObj ? selectedObj.physical_stock : 0;
                const inQty = parseInt(item.quantity) || 0;

                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 sm:col-span-5">
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Pilih Laptop *</label>
                      <select
                        required
                        value={item.laptop_id}
                        onChange={(e) => handleItemChange(idx, 'laptop_id', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none"
                      >
                        <option value="">-- Pilih Laptop --</option>
                        {laptops.map(l => (
                          <option key={l.id} value={l.id}>
                            [{l.code}] {l.name} — Stok Fisik: {l.physical_stock}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Qty Masuk *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-bold font-mono text-center focus:outline-none"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Harga Beli / Unit (Rp)</label>
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono focus:outline-none"
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Subtotal</span>
                        <strong className="font-mono text-blue-600 text-xs">
                          {formatRupiah((item.quantity || 0) * (item.unit_price || 0))}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={items.length === 1}
                        className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-20 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {selectedObj && (
                      <div className="col-span-12 pt-1 border-t border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
                        <span>Dampak Stok:</span>
                        <span>Stok Saat Ini ({currentPhysical})</span>
                        <span className="text-emerald-600 font-bold">+ Masuk ({inQty})</span>
                        <span>➔</span>
                        <strong className="text-blue-600">Stok Baru: {currentPhysical + inQty} Unit</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Catatan & Ringkasan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Catatan Penerimaan</label>
                <textarea
                  rows="3"
                  placeholder="Catatan no resi, kondisi paket, atau keterangan lainnya..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-800 block">Ringkasan Pengadaan</span>
                  <div className="flex justify-between text-slate-600 pt-1">
                    <span>Total Unit Masuk:</span>
                    <strong className="font-mono text-slate-900">{calculateTotalQuantity()} Unit</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Biaya:</span>
                    <strong className="font-mono text-emerald-600 text-sm">{formatRupiah(calculateTotalAmount())}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-2.5 rounded-lg font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Barang Masuk'}
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* TAB 2: FORM BARANG KELUAR */}
      {activeTab === 'KELUAR' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-soft p-6 space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Form Penjualan Barang Keluar</h2>
            <p className="text-xs text-slate-500">Mencatat unit laptop yang terjual dan mengurangi stok fisik.</p>
          </div>

          <form onSubmit={handleSubmitTransaction} className="space-y-5 text-xs">
            
            {/* Data Customer */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                1. Data Pembeli / Customer
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">Nama Pembeli *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Bpk. Hendra"
                    value={outCustomerName}
                    onChange={(e) => setOutCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Kontak WhatsApp / HP</label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={outCustomerContact}
                    onChange={(e) => setOutCustomerContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Daftar Item Laptop Keluar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider block text-[10px]">
                  2. Daftar Laptop yang Dikeluarkan
                </span>
                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-600 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Baris
                </button>
              </div>

              {items.map((item, idx) => {
                const selectedObj = laptops.find(l => l.id === parseInt(item.laptop_id));
                const currentPhysical = selectedObj ? selectedObj.physical_stock : 0;
                const outQty = parseInt(item.quantity) || 0;
                const isOver = outQty > currentPhysical;

                return (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-12 sm:col-span-5">
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Pilih Laptop *</label>
                      <select
                        required
                        value={item.laptop_id}
                        onChange={(e) => handleItemChange(idx, 'laptop_id', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-semibold focus:outline-none"
                      >
                        <option value="">-- Pilih Laptop --</option>
                        {laptops.map(l => (
                          <option key={l.id} value={l.id} disabled={l.physical_stock <= 0}>
                            [{l.code}] {l.name} — Stok Fisik: {l.physical_stock} {l.physical_stock <= 0 ? '(STOK HABIS)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-span-6 sm:col-span-2">
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">
                        Qty Keluar * (Maks: {currentPhysical})
                      </label>
                      <input
                        type="number"
                        min="1"
                        max={currentPhysical > 0 ? currentPhysical : 1}
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        className={`w-full px-2.5 py-1.5 rounded-lg font-bold font-mono text-center focus:outline-none ${
                          isOver ? 'border-2 border-red-500 bg-red-50 text-red-700' : 'bg-white border border-slate-200 text-slate-900'
                        }`}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label className="block text-[10px] text-slate-500 font-medium mb-1">Harga Jual / Unit (Rp)</label>
                      <input
                        type="number"
                        value={item.unit_price}
                        onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-900 font-mono focus:outline-none"
                      />
                    </div>

                    <div className="col-span-12 sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Subtotal</span>
                        <strong className="font-mono text-blue-600 text-xs">
                          {formatRupiah((item.quantity || 0) * (item.unit_price || 0))}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveItemRow(idx)}
                        disabled={items.length === 1}
                        className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-20 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {selectedObj && (
                      <div className="col-span-12 pt-1 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>Dampak Stok:</span>
                          <span>Stok Saat Ini ({currentPhysical})</span>
                          <span className="text-red-600 font-bold">- Keluar ({outQty})</span>
                          <span>➔</span>
                          <strong className={currentPhysical - outQty === 0 ? 'text-red-600' : 'text-blue-600'}>
                            Sisa Stok Fisik: {Math.max(0, currentPhysical - outQty)} Unit
                          </strong>
                        </div>
                        {isOver && <span className="text-red-600 font-bold">Melebihi stok fisik tersedia!</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Catatan & Ringkasan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Catatan Penjualan</label>
                <textarea
                  rows="3"
                  placeholder="Keterangan garansi, nota manual, atau kelengkapan..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-800 block">Ringkasan Penjualan</span>
                  <div className="flex justify-between text-slate-600 pt-1">
                    <span>Total Unit Keluar:</span>
                    <strong className="font-mono text-slate-900">{calculateTotalQuantity()} Unit</strong>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total Penjualan:</span>
                    <strong className="font-mono text-blue-600 text-sm">{formatRupiah(calculateTotalAmount())}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-3 py-2.5 rounded-lg font-semibold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Barang Keluar'}
                </button>
              </div>
            </div>

          </form>
        </div>
      )}

      {/* TAB 3: RIWAYAT TRANSAKSI */}
      {activeTab === 'RIWAYAT' && (
        <div className="space-y-4">
          
          {/* Filters */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-soft grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Cari No. Transaksi / Customer</label>
              <input
                type="text"
                placeholder="TRX-..."
                value={historySearch}
                onChange={(e) => setHistorySearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Jenis Transaksi</label>
              <select
                value={historyType}
                onChange={(e) => setHistoryType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
              >
                <option value="">Semua Jenis</option>
                <option value="MASUK">Barang Masuk</option>
                <option value="KELUAR">Barang Keluar</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Dari Tanggal</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 font-medium mb-1">Sampai Tanggal</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3.5">Tanggal</th>
                    <th className="py-3 px-3.5">Nomor Transaksi</th>
                    <th className="py-3 px-3.5">Jenis</th>
                    <th className="py-3 px-3.5">Sumber / Customer</th>
                    <th className="py-3 px-3.5 text-center">Jumlah</th>
                    <th className="py-3 px-3.5 text-right">Total Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    [1, 2, 3].map(n => (
                      <tr key={n} className="animate-pulse">
                        <td colSpan="6" className="py-3 px-4"><div className="h-4 bg-slate-100 rounded" /></td>
                      </tr>
                    ))
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-slate-400">
                        Belum ada riwayat transaksi terdaftar.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3.5 font-mono">{formatDate(tx.transaction_date)}</td>
                        <td className="py-3 px-3.5 font-mono font-bold text-slate-900">{tx.transaction_code}</td>
                        <td className="py-3 px-3.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            tx.type === 'MASUK'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {tx.type === 'MASUK' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            {tx.type === 'MASUK' ? 'Barang Masuk' : 'Barang Keluar'}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-medium text-slate-800">{tx.source_destination || '-'}</td>
                        <td className="py-3 px-3.5 text-center font-mono font-bold text-slate-900">{tx.total_quantity} Unit</td>
                        <td className="py-3 px-3.5 text-right font-mono font-bold text-slate-900">{formatRupiah(tx.total_amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AdminTransactionsPage;

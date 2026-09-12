import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  History,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Search,
  Calendar,
  Eye,
  X,
  Printer,
  Receipt,
  FileText,
  Filter,
  RefreshCw,
  Clock,
  Package,
  Layers,
  ChevronLeft,
  Trash2
} from 'lucide-react';

const AdminTransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [deleteModalTx, setDeleteModalTx] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [revertStockOnDelete, setRevertStockOnDelete] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(''); // '', 'MASUK', 'KELUAR'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [typeFilter, startDate, endDate, page]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 15,
        type: typeFilter || undefined,
        search: search.trim() || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined
      };

      const res = await api.get('/transactions', { params });
      if (res.data?.success) {
        setTransactions(res.data.data || []);
        if (res.data.pagination) {
          setTotalPages(res.data.pagination.total_pages || 1);
          setTotalItems(res.data.pagination.total_items || 0);
        } else {
          setTotalPages(1);
          setTotalItems(res.data.data?.length || 0);
        }
      }
    } catch (err) {
      console.error('Error fetching transaction history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setSearch('');
    setTypeFilter('');
    setStartDate('');
    setEndDate('');
    setPage(1);
  };

  const handleViewDetail = async (tx) => {
    setLoadingDetail(true);
    setSelectedTx(tx);
    try {
      const res = await api.get(`/transactions/${tx.id}`);
      if (res.data?.success && res.data.data) {
        setSelectedTx(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching transaction detail:', err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDeleteClick = (tx) => {
    setDeleteModalTx(tx);
    setRevertStockOnDelete(false);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalTx) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/transactions/${deleteModalTx.id}?revert_stock=${revertStockOnDelete}`);
      if (res.data?.success) {
        setDeleteModalTx(null);
        fetchTransactions();
      }
    } catch (err) {
      console.error('Error deleting transaction:', err);
      alert(err.response?.data?.message || 'Gagal menghapus transaksi.');
    } finally {
      setDeleting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* ========================================================
          1. BREADCRUMB & HEADER SECTION
          ======================================================== */}
      <div className="space-y-3">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Transaksi</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-semibold">Riwayat Transaksi</span>
        </nav>

        {/* Title Bar & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-md shadow-slate-900/20">
                <History className="w-5 h-5 stroke-2" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Riwayat Transaksi
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Arsip lengkap seluruh transaksi penerimaan barang masuk dan pengeluaran barang keluar.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              to="/admin/transactions/in"
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>Barang Masuk</span>
            </Link>
            <Link
              to="/admin/transactions/out"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Barang Keluar</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. FILTER & SEARCH BAR SECTION
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3.5">
        
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="sm:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari no. transaksi / customer / dealer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="sm:col-span-3 flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => { setTypeFilter(''); setPage(1); }}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                typeFilter === '' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => { setTypeFilter('MASUK'); setPage(1); }}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                typeFilter === 'MASUK' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowDownLeft className="w-3 h-3" />
              <span>Masuk</span>
            </button>
            <button
              type="button"
              onClick={() => { setTypeFilter('KELUAR'); setPage(1); }}
              className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                typeFilter === 'KELUAR' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowUpRight className="w-3 h-3" />
              <span>Keluar</span>
            </button>
          </div>

          {/* Date Filter Range */}
          <div className="sm:col-span-3 grid grid-cols-2 gap-1.5 text-xs">
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-medium focus:outline-none cursor-pointer"
              title="Dari Tanggal"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-medium focus:outline-none cursor-pointer"
              title="Sampai Tanggal"
            />
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 flex items-center gap-1.5">
            <button
              type="submit"
              className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer text-center"
            >
              Terapkan
            </button>
            {(search || typeFilter || startDate || endDate) && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition-colors cursor-pointer"
                title="Reset Filter"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

        </form>

      </div>

      {/* ========================================================
          3. TRANSACTIONS TABLE
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-800">
              Daftar Transaksi ({totalItems} Data Ditemukan)
            </span>
          </div>
          <button
            type="button"
            onClick={fetchTransactions}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Tanggal Transaksi</th>
                <th className="py-3 px-4">No. Dokumen</th>
                <th className="py-3 px-4">Jenis</th>
                <th className="py-3 px-4">Sumber / Tujuan</th>
                <th className="py-3 px-4 text-center">Total Unit</th>
                <th className="py-3 px-4 text-right">Total Nominal</th>
                <th className="py-3 px-4">Catatan / No. Ref</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [1, 2, 3, 4, 5].map(n => (
                  <tr key={n} className="animate-pulse">
                    <td colSpan="8" className="py-3.5 px-4"><div className="h-4 bg-slate-100 rounded" /></td>
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400">
                    Tidak ada riwayat transaksi yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {formatDate(tx.transaction_date)}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {tx.transaction_code}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        tx.type === 'MASUK'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {tx.type === 'MASUK' ? (
                          <>
                            <ArrowDownLeft className="w-3 h-3 text-emerald-600" />
                            <span>Barang Masuk</span>
                          </>
                        ) : (
                          <>
                            <ArrowUpRight className="w-3 h-3 text-blue-600" />
                            <span>Barang Keluar</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-800 font-medium">
                      {tx.source_destination || '-'}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                      {tx.type === 'MASUK' ? '+' : '-'}{tx.total_quantity} Unit
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      {formatRupiah(tx.total_amount)}
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate" title={tx.notes}>
                      {tx.notes || '-'}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleViewDetail(tx)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 mx-auto border border-slate-200"
                        title="Lihat Detail Transaksi"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail Struk</span>
                      </button>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleViewDetail(tx)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200"
                          title="Lihat Detail Transaksi"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail Struk</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(tx)}
                          className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-500 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1 border border-slate-200"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <div>
              Halaman <span className="font-bold text-slate-900">{page}</span> dari <span className="font-bold text-slate-900">{totalPages}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          4. TRANSACTION DETAIL & PRINTABLE INVOICE MODAL
          ======================================================== */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 space-y-5 animate-in zoom-in-95 duration-200 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                  selectedTx.type === 'MASUK' ? 'bg-emerald-600' : 'bg-blue-600'
                }`}>
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Faktur / Struk Transaksi
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {selectedTx.transaction_code}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                  title="Cetak Struk"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Cetak</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTx(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Invoice Printable Body */}
            <div className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/90">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Jenis Transaksi</span>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedTx.type === 'MASUK'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedTx.type === 'MASUK' ? 'Barang Masuk (Pengadaan)' : 'Barang Keluar (Penjualan)'}
                  </span>
                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pihak Terkait</span>
                    <strong className="text-slate-900 font-semibold block">{selectedTx.source_destination || '-'}</strong>
                  </div>
                </div>

                <div className="space-y-1 text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Waktu Transaksi</span>
                  <span className="font-mono text-slate-800 font-semibold block">{formatDate(selectedTx.transaction_date)}</span>
                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Catatan / Referensi</span>
                    <span className="text-slate-600 italic block">{selectedTx.notes || 'Tidak ada catatan'}</span>
                  </div>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">Model Laptop</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Harga Satuan</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingDetail ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-slate-400">
                          Memuat rincian item...
                        </td>
                      </tr>
                    ) : selectedTx.items && selectedTx.items.length > 0 ? (
                      selectedTx.items.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="py-2.5 px-3 text-slate-400 font-mono">{i + 1}</td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-800 block">
                              {item.laptop_name || 'Unit Laptop'}
                            </span>
                            {item.laptop_code && (
                              <span className="text-[10px] text-slate-400 font-mono block">
                                SKU: {item.laptop_code}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-700">
                            {item.quantity}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                            {formatRupiah(item.unit_price)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            {formatRupiah(item.subtotal || (item.quantity * item.unit_price))}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="py-4 text-center text-slate-400 italic">
                          Rincian item tidak tersedia.
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                    <tr>
                      <td colSpan="2" className="py-2.5 px-3 text-slate-700 uppercase text-[11px]">
                        Total Keseluruhan
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono text-slate-900">
                        {selectedTx.total_quantity} Unit
                      </td>
                      <td colSpan="2" className="py-2.5 px-3 text-right font-mono text-base text-blue-700">
                        {formatRupiah(selectedTx.total_amount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================
          5. DELETE CONFIRMATION MODAL
          ======================================================== */}
      {deleteModalTx && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Hapus Riwayat Transaksi</h3>
                <p className="text-xs text-slate-500 font-mono">{deleteModalTx.transaction_code}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Jenis:</span>
                <strong className="text-slate-900">{deleteModalTx.type === 'MASUK' ? 'Barang Masuk' : 'Barang Keluar'}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pihak Terkait:</span>
                <strong className="text-slate-900">{deleteModalTx.source_destination || '-'}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total:</span>
                <strong className="text-slate-900">{deleteModalTx.total_quantity} Unit ({formatRupiah(deleteModalTx.total_amount)})</strong>
              </div>
              {deleteModalTx.notes && (
                <div className="flex justify-between text-slate-600">
                  <span>Catatan:</span>
                  <span className="italic text-slate-700">{deleteModalTx.notes}</span>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={revertStockOnDelete}
                onChange={(e) => setRevertStockOnDelete(e.target.checked)}
                className="mt-0.5 rounded border-amber-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
              <span className="text-slate-700 leading-relaxed">
                <strong>Kembalikan stok laptop (Revert Stok)</strong>
                <span className="block text-[11px] text-slate-500">
                  {deleteModalTx.type === 'MASUK' 
                    ? 'Kurangi kembali stok fisik laptop yang ditambahkan oleh transaksi ini.'
                    : 'Tambahkan kembali stok fisik laptop yang dikurangi oleh transaksi ini.'}
                </span>
              </span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteModalTx(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Ya, Hapus</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminTransactionHistoryPage;

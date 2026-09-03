import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Laptop,
  Sparkles,
  Tag,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  Shield,
  Zap,
  BarChart3,
  Calendar
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/dashboard/summary');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error('Fetch dashboard summary error:', err);
      setError('Data dashboard gagal dimuat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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
      year: 'numeric'
    });
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-8 bg-slate-200 rounded-lg w-40 animate-pulse" />
          <div className="h-4 bg-slate-100 rounded-lg w-64 animate-pulse" />
        </div>

        {/* Skeleton Row 1: 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3 animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/2" />
              <div className="h-8 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          ))}
        </div>

        {/* Skeleton Split Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3 animate-pulse">
            <div className="h-5 bg-slate-100 rounded w-1/3" />
            <div className="h-48 bg-slate-100 rounded" />
          </div>
          <div className="lg:col-span-7 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3 animate-pulse">
            <div className="h-5 bg-slate-100 rounded w-1/3" />
            <div className="h-48 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 my-8">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-800">{error}</h3>
          <p className="text-xs text-slate-500">Periksa koneksi jaringan atau server backend Anda.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const { cards, brand_summary, latest_transactions } = data || {
    cards: { total_laptop: 0, laptop_baru: 0, laptop_second: 0, estimasi_nilai_stok: 0 },
    brand_summary: [],
    latest_transactions: []
  };

  // Limit latest transactions strictly to max 5 items
  const displayTransactions = (latest_transactions || []).slice(0, 5);

  // Total physical stock across all brands for percentage calculation
  const totalAllStock = brand_summary.reduce((acc, b) => acc + (b.total_physical_stock || 0), 0);

  const effectiveBrandList = brand_summary || [];

  return (
    <div className="space-y-6">
      
      {/* ========================================================
          PAGE HEADER
          ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ringkasan kondisi inventaris laptop Dhafi Komputer.
          </p>
        </div>
      </div>

      {/* ========================================================
          ROW 1 — EXACTLY FOUR STATISTIC CARDS (MATCHING REFERENCE)
          Desktop: 4 columns | Tablet: 2x2 | Mobile: 1 column
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* CARD 1: Total Laptop */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Total Laptop</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60">
              <Laptop className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
                {cards.total_laptop ?? 0}
              </span>
              <span className="text-xs font-medium text-slate-500">Unit</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">Seluruh laptop terdaftar</span>
          </div>
        </div>

        {/* CARD 2: Laptop Baru */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Laptop Baru</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-emerald-600 font-mono tracking-tight">
                {cards.laptop_baru ?? 0}
              </span>
              <span className="text-xs font-medium text-slate-500">Unit</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">Laptop baru</span>
          </div>
        </div>

        {/* CARD 3: Laptop Second */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600">Laptop Second</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100/60">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-amber-600 font-mono tracking-tight">
                {cards.laptop_second ?? 0}
              </span>
              <span className="text-xs font-medium text-slate-500">Unit</span>
            </div>
            <span className="text-xs text-slate-400 mt-0.5 block">Laptop second</span>
          </div>
        </div>

        {/* CARD 4: Estimasi Nilai Stok Fisik Inventaris */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 leading-tight">Estimasi Nilai Stok Fisik Inventaris</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/60 shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900 block truncate font-mono tracking-tight">
              {formatRupiah(cards.estimasi_nilai_stok ?? 0)}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block leading-tight">
              Total taksiran nilai aset berdasarkan harga jual terakhir.
            </span>
          </div>
        </div>

      </div>

      {/* ========================================================
          SPLIT LAYOUT:
          LEFT: RINGKASAN STOK BERDASARKAN BRAND (5 COLS)
          RIGHT: TRANSAKSI TERBARU (7 COLS)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ========================================================
            LEFT (5 COLS): RINGKASAN STOK BERDASARKAN BRAND
            ======================================================== */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Ringkasan Stok Berdasarkan Brand</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">Persentase stok fisik unit per merek terdaftar.</p>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              {effectiveBrandList.length} Brand
            </span>
          </div>

          <div className="space-y-4">
            {effectiveBrandList.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Belum ada data merek terdaftar.
              </div>
            ) : (
              effectiveBrandList.map((b) => {
                // Calculate brand share
                const stock = b.total_physical_stock || 0;
                const percent = totalAllStock > 0 ? Math.round((stock / totalAllStock) * 100) : 0;
                const hasStock = stock > 0;

                return (
                  <div key={b.brand_id || b.brand_name} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{b.brand_name}</span>
                        <span className="text-[11px] text-slate-400 font-medium">({b.total_laptop_types || 0} model)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`font-mono font-bold text-xs ${hasStock ? 'text-blue-600' : 'text-slate-500'}`}>
                          {stock} <span className="font-normal text-slate-400 text-[10px]">Unit</span>
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 w-7 text-right">
                          {percent}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          hasStock ? 'bg-blue-600' : 'bg-slate-200 w-1.5'
                        }`}
                        style={{ width: hasStock ? `${Math.max(percent, 4)}%` : '4px' }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Card Link */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <Link
              to="/admin/master-data?tab=brands"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              <span>Lihat Semua Brand</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* ========================================================
            RIGHT (7 COLS): TRANSAKSI TERBARU (MAX 5 ITEMS)
            ======================================================== */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Transaksi Terbaru</h2>
              <p className="text-[11px] text-slate-500 mt-0.5">5 transaksi terakhir masuk dan keluar terakhir.</p>
            </div>

            <Link
              to="/admin/transactions?tab=history"
              className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-blue-600 font-semibold text-xs flex items-center gap-1 transition-all border border-slate-200 hover:border-blue-200"
            >
              <span>Lihat Semua</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">TANGGAL</th>
                  <th className="py-2.5 px-3 font-semibold">NOMOR TRANSAKSI</th>
                  <th className="py-2.5 px-3 font-semibold">JENIS</th>
                  <th className="py-2.5 px-3 font-semibold">LAPTOP</th>
                  <th className="py-2.5 px-3 font-semibold text-right">JUMLAH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400">
                      Belum ada riwayat transaksi terdaftar.
                    </td>
                  </tr>
                ) : (
                  displayTransactions.map((tx) => {
                    const isMasuk = tx.type === 'MASUK';
                    return (
                      <tr key={tx.id} className="hover:bg-blue-50/40 transition-colors group">
                        
                        {/* Tanggal with Calendar Icon */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-400 shrink-0">
                              <Calendar className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-medium text-slate-600">{formatDate(tx.transaction_date)}</span>
                          </div>
                        </td>

                        {/* Nomor Transaksi */}
                        <td className="py-3 px-3 font-mono font-bold text-slate-900">
                          {tx.transaction_code}
                        </td>

                        {/* Jenis Transaksi */}
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                            isMasuk
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200/70'
                          }`}>
                            {isMasuk ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            <span>{isMasuk ? 'MASUK' : 'KELUAR'}</span>
                          </span>
                        </td>

                        {/* Laptop / Customer / Dealer Source */}
                        <td className="py-3 px-3 font-medium text-slate-800 max-w-50 truncate">
                          {tx.source_destination ? (
                            <span>{tx.source_destination}</span>
                          ) : (
                            <span>{tx.laptop_name || 'Unit Laptop'}</span>
                          )}
                        </td>

                        {/* Jumlah */}
                        <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                          {tx.total_quantity} Unit
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboardPage;

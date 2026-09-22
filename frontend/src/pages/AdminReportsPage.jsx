import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Printer,
  FileText,
  Filter,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  Boxes,
  ChevronRight,
  Clock
} from 'lucide-react';

const AdminReportsPage = () => {
  const [activeTab, setActiveTab] = useState('INVENTORY'); // 'INVENTORY', 'IN', 'OUT'

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [masterDealers, setMasterDealers] = useState([]);
  const [dealers, setDealers] = useState([]);

  // Report Data
  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  // Filters
  const [filterBrand, setFilterBrand] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterCondition, setFilterCondition] = useState('');
  const [filterMD, setFilterMD] = useState('');
  const [filterDealer, setFilterDealer] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [activeTab, filterBrand, filterCategory, filterCondition, filterMD, filterDealer, filterStatus, startDate, endDate]);

  const fetchMetadata = async () => {
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
      console.error('Metadata fetch error:', err);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      let endpoint = '/reports/inventory';
      const params = {};

      if (activeTab === 'INVENTORY') {
        endpoint = '/reports/inventory';
        if (filterBrand) params.brand_id = filterBrand;
        if (filterCategory) params.category_id = filterCategory;
        if (filterCondition) params.condition_type = filterCondition;
        if (filterMD) params.master_dealer_id = filterMD;
        if (filterDealer) params.dealer_id = filterDealer;
        if (filterStatus) params.status = filterStatus;
      } else if (activeTab === 'IN') {
        endpoint = '/reports/transactions-in';
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (filterBrand) params.brand_id = filterBrand;
        if (filterCondition) params.condition_type = filterCondition;
      } else if (activeTab === 'OUT') {
        endpoint = '/reports/transactions-out';
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (filterBrand) params.brand_id = filterBrand;
        if (filterCondition) params.condition_type = filterCondition;
      }

      const res = await api.get(endpoint, { params });
      if (res.data?.success) {
        setReportData(res.data.data || []);
        setSummary(res.data.summary || {});
      }
    } catch (err) {
      console.error('Fetch report error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterBrand('');
    setFilterCategory('');
    setFilterCondition('');
    setFilterMD('');
    setFilterDealer('');
    setFilterStatus('');
    setStartDate('');
    setEndDate('');
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
      year: 'numeric'
    });
  };

  const handleDirectPrint = () => {
    window.print();
  };

  const getReportTitle = () => {
    if (activeTab === 'INVENTORY') return 'LAPORAN REKAPITULASI STOK INVENTARIS LAPTOP';
    if (activeTab === 'IN') return 'LAPORAN REKAPITULASI MUTASI BARANG MASUK (PENGADAAN)';
    return 'LAPORAN REKAPITULASI MUTASI PENJUALAN BARANG KELUAR';
  };

  return (
    <div className="space-y-6 pb-16 print:space-y-4 print:pb-0 print:m-0 print:p-[12mm] print-page-padding">
      
      {/* Dynamic Style to strip browser default header/footer (localhost:3000/... 1/1) */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 0mm !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}} />
      
      {/* ========================================================
          1. BREADCRUMB & HEADER SECTION (Screen only)
          ======================================================== */}
      <div className="space-y-3 print:hidden">
        
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/admin/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-semibold">Laporan</span>
        </nav>

        {/* Title Bar & Direct Print Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                <FileText className="w-5 h-5 stroke-2" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Laporan Inventaris & Transaksi
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Rekapitulasi berkala stok unit laptop, penerimaan pengadaan, dan mutasi penjualan.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleDirectPrint}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-2 active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          OFFICIAL PRINT LETTERHEAD & HEADER (Visible ONLY on print)
          ======================================================== */}
      <div className="hidden print:block border-b-2 border-black pb-3 mb-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tight uppercase text-black">
              DHAFI KOMPUTER BANDUNG
            </h1>
            <p className="text-[10px] text-slate-800 leading-snug mt-0.5 max-w-lg">
              Pusat Inventaris & Penjualan Laptop Baru & Second Terpercaya<br />
              Bandung Electronics Center, Bandung BEC, Blk. F No.17a Lt.1, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40117<br />
              Telp / WhatsApp: 0896-0903-3525 | Email: dhafionline18@gmail.com
            </p>
          </div>
          <div className="text-right text-[10px]">
            <span className="font-bold uppercase block text-slate-600">Dokumen Laporan</span>
            <span className="font-mono font-bold text-black text-xs">
              DOC-{activeTab}-{Date.now().toString().slice(-6)}
            </span>
            <span className="text-slate-600 block mt-0.5">
              Tgl Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      {/* Print Document Title */}
      <div className="hidden print:block text-center mb-4 space-y-0.5">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-black underline underline-offset-4">
          {getReportTitle()}
        </h2>
        {(startDate || endDate) && (
          <p className="text-[10px] text-slate-700 font-medium pt-0.5">
            Periode: {startDate ? formatDate(startDate) : 'Awal'} s/d {endDate ? formatDate(endDate) : 'Hari Ini'}
          </p>
        )}
      </div>

      

      {/* ========================================================
          2. TAB NAVIGATION (Screen only)
          ======================================================== */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 text-xs print:hidden">
        <button
          onClick={() => { setActiveTab('INVENTORY'); resetFilters(); }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'INVENTORY'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Stok Inventaris</span>
        </button>

        <button
          onClick={() => { setActiveTab('IN'); resetFilters(); }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'IN'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
          <span>Mutasi Barang Masuk</span>
        </button>

        <button
          onClick={() => { setActiveTab('OUT'); resetFilters(); }}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'OUT'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
          }`}
        >
          <ArrowUpRight className="w-4 h-4 text-blue-600" />
          <span>Mutasi Barang Keluar</span>
        </button>
      </div>

      {/* ========================================================
          3. FILTER SECTION (Screen only)
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 space-y-3 print:hidden">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            Parameter Filter Laporan
          </span>
          <button
            onClick={resetFilters}
            className="text-[11px] text-slate-500 hover:text-blue-600 font-semibold cursor-pointer transition-colors"
          >
            Reset Filter
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {activeTab === 'INVENTORY' && (
            <>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block text-[11px]">Merek Laptop</label>
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none"
                >
                  <option value="">Semua Merek</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block text-[11px]">Kategori</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none"
                >
                  <option value="">Semua Kategori</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block text-[11px]">Kondisi Laptop</label>
                <select
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none"
                >
                  <option value="">Semua Kondisi</option>
                  <option value="BARU">Laptop Baru</option>
                  <option value="SECOND">Laptop Second</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block text-[11px]">Status Ketersediaan</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none"
                >
                  <option value="">Semua Status</option>
                  <option value="TERSEDIA">Tersedia</option>
                  <option value="HABIS">Habis</option>
                </select>
              </div>
            </>
          )}

          {(activeTab === 'IN' || activeTab === 'OUT') && (
            <>
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block text-[11px]">Dari Tanggal</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block text-[11px]">Sampai Tanggal</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block text-[11px]">Merek Laptop</label>
                <select
                  value={filterBrand}
                  onChange={(e) => setFilterBrand(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none"
                >
                  <option value="">Semua Merek</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-600 block text-[11px]">Kondisi Laptop</label>
                <select
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:outline-none"
                >
                  <option value="">Semua Kondisi</option>
                  <option value="BARU">Laptop Baru</option>
                  <option value="SECOND">Laptop Second</option>
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================
          5. MAIN REPORT TABLE (Optimized for both screen & print)
          ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden print:border-none print:shadow-none">

        <div className="overflow-x-auto">
          {/* TAB 1: INVENTORY TABLE */}
          {activeTab === 'INVENTORY' && (
            <table className="w-full text-left text-xs border-collapse print:border print:border-slate-400 print:text-[10px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider print:bg-slate-200 print:text-black print:border-slate-400">
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400 print:text-center w-8">No</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">Kode SKU</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">Model Laptop</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">Merek & Kategori</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400 print:text-center">Kondisi</th>
                  <th className="py-3 px-3.5 text-right print:py-1.5 print:px-2 print:border-r print:border-slate-400">Harga Modal</th>
                  <th className="py-3 px-3.5 text-right print:py-1.5 print:px-2 print:border-r print:border-slate-400">Harga Jual</th>
                  <th className="py-3 px-3 text-center print:py-1.5 print:px-2 print:border-r print:border-slate-400">Display</th>
                  <th className="py-3 px-3 text-center print:py-1.5 print:px-2 print:border-r print:border-slate-400">Fisik</th>
                  <th className="py-3 px-3.5 text-right print:py-1.5 print:px-2">Total Valuasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                {loading ? (
                  [1, 2, 3, 4, 5].map(n => (
                    <tr key={n} className="animate-pulse">
                      <td colSpan="10" className="py-3.5 px-4"><div className="h-4 bg-slate-100 rounded" /></td>
                    </tr>
                  ))
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-10 text-center text-slate-400">
                      Tidak ada data stok inventaris yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  reportData.map((row, i) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors print:border-b print:border-slate-300">
                      <td className="py-2.5 px-3.5 font-mono text-center text-slate-500 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {i + 1}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono font-bold text-blue-600 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {row.code}
                      </td>
                      <td className="py-2.5 px-3.5 font-semibold text-slate-900 print:py-1.5 print:px-2 print:border-r print:border-slate-300">
                        {row.name}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-600 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {row.brand_name} · {row.category_name}
                      </td>
                      <td className="py-2.5 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold print:p-0 print:border-none ${
                          row.condition_type === 'BARU' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {row.condition_type}
                        </span>
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-600 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {formatRupiah(row.purchase_price)}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900 print:py-1.5 print:px-2 print:border-r print:border-slate-300">
                        {formatRupiah(row.selling_price)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono print:py-1.5 print:px-2 print:border-r print:border-slate-300">
                        {row.display_stock}
                      </td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-600 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {row.physical_stock}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono font-bold text-slate-900 print:py-1.5 print:px-2">
                        {formatRupiah(row.total_asset_value)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="hidden print:table-footer-group bg-slate-200 font-bold border-t-2 border-black text-[10px]">
                <tr>
                  <td colSpan="7" className="py-1.5 px-2 uppercase text-right border-r border-slate-400">
                    Total Keseluruhan
                  </td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-400 font-mono">{summary.total_display_stock || 0}</td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-400 font-mono">{summary.total_physical_stock || 0}</td>
                  <td className="py-1.5 px-2 text-right font-mono font-bold text-black">{formatRupiah(summary.total_asset_value)}</td>
                </tr>
              </tfoot>
            </table>
          )}

          {/* TAB 2: BARANG MASUK TABLE */}
          {activeTab === 'IN' && (
            <table className="w-full text-left text-xs border-collapse print:border print:border-slate-400 print:text-[10px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider print:bg-slate-200 print:text-black print:border-slate-400">
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400 print:text-center w-8">No</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">Tanggal</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">No. Transaksi</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">Sumber Pengadaan</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">Model Laptop</th>
                  <th className="py-3 px-3.5 text-center print:py-1.5 print:px-2 print:border-r print:border-slate-400">Jumlah</th>
                  <th className="py-3 px-3.5 text-right print:py-1.5 print:px-2 print:border-r print:border-slate-400">Harga Beli</th>
                  <th className="py-3 px-3.5 text-right print:py-1.5 print:px-2">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                {loading ? (
                  [1, 2, 3, 4, 5].map(n => (
                    <tr key={n} className="animate-pulse">
                      <td colSpan="8" className="py-3.5 px-4"><div className="h-4 bg-slate-100 rounded" /></td>
                    </tr>
                  ))
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-10 text-center text-slate-400">
                      Tidak ada transaksi pengadaan barang masuk sesuai filter.
                    </td>
                  </tr>
                ) : (
                  reportData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors print:border-b print:border-slate-300">
                      <td className="py-2.5 px-3.5 font-mono text-center text-slate-500 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-600 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {formatDate(row.transaction_date)}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono font-bold text-blue-600 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {row.transaction_code}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-800 font-medium print:py-1.5 print:px-2 print:border-r print:border-slate-300">
                        {row.source_destination || '-'}
                      </td>
                      <td className="py-2.5 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-300">
                        <strong className="text-slate-900 block">{row.laptop_name}</strong>
                        <span className="text-[10px] text-slate-400 font-mono print:text-slate-600">{row.laptop_code}</span>
                      </td>
                      <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-900 print:py-1.5 print:px-2 print:border-r print:border-slate-300">
                        +{row.quantity} Unit
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-600 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {formatRupiah(row.unit_price)}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono font-bold text-emerald-700 print:py-1.5 print:px-2 print:text-black">
                        {formatRupiah(row.subtotal)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="hidden print:table-footer-group bg-slate-200 font-bold border-t-2 border-black text-[10px]">
                <tr>
                  <td colSpan="5" className="py-1.5 px-2 uppercase text-right border-r border-slate-400">
                    Total Keseluruhan
                  </td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-400 font-mono">+{summary.total_quantity || 0} Unit</td>
                  <td className="py-1.5 px-2 border-r border-slate-400"></td>
                  <td className="py-1.5 px-2 text-right font-mono font-bold text-black">{formatRupiah(summary.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
          )}

          {/* TAB 3: BARANG KELUAR TABLE */}
          {activeTab === 'OUT' && (
            <table className="w-full text-left text-xs border-collapse print:border print:border-slate-400 print:text-[10px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider print:bg-slate-200 print:text-black print:border-slate-400">
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400 print:text-center w-8">No</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">Tanggal</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">No. Transaksi</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">Customer / Tujuan</th>
                  <th className="py-3 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-400">Model Laptop</th>
                  <th className="py-3 px-3.5 text-center print:py-1.5 print:px-2 print:border-r print:border-slate-400">Jumlah</th>
                  <th className="py-3 px-3.5 text-right print:py-1.5 print:px-2 print:border-r print:border-slate-400">Harga Jual</th>
                  <th className="py-3 px-3.5 text-right print:py-1.5 print:px-2">Total Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 print:divide-slate-300">
                {loading ? (
                  [1, 2, 3, 4, 5].map(n => (
                    <tr key={n} className="animate-pulse">
                      <td colSpan="8" className="py-3.5 px-4"><div className="h-4 bg-slate-100 rounded" /></td>
                    </tr>
                  ))
                ) : reportData.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-10 text-center text-slate-400">
                      Tidak ada transaksi penjualan barang keluar sesuai filter.
                    </td>
                  </tr>
                ) : (
                  reportData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors print:border-b print:border-slate-300">
                      <td className="py-2.5 px-3.5 font-mono text-center text-slate-500 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {idx + 1}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono text-slate-600 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {formatDate(row.transaction_date)}
                      </td>
                      <td className="py-2.5 px-3.5 font-mono font-bold text-blue-600 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {row.transaction_code}
                      </td>
                      <td className="py-2.5 px-3.5 text-slate-800 font-medium print:py-1.5 print:px-2 print:border-r print:border-slate-300">
                        {row.source_destination || '-'}
                      </td>
                      <td className="py-2.5 px-3.5 print:py-1.5 print:px-2 print:border-r print:border-slate-300">
                        <strong className="text-slate-900 block">{row.laptop_name}</strong>
                        <span className="text-[10px] text-slate-400 font-mono print:text-slate-600">{row.laptop_code}</span>
                      </td>
                      <td className="py-2.5 px-3.5 text-center font-mono font-bold text-slate-900 print:py-1.5 print:px-2 print:border-r print:border-slate-300">
                        -{row.quantity} Unit
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono text-slate-600 print:py-1.5 print:px-2 print:border-r print:border-slate-300 print:text-black">
                        {formatRupiah(row.unit_price)}
                      </td>
                      <td className="py-2.5 px-3.5 text-right font-mono font-bold text-blue-600 print:py-1.5 print:px-2 print:text-black">
                        {formatRupiah(row.subtotal)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="hidden print:table-footer-group bg-slate-200 font-bold border-t-2 border-black text-[10px]">
                <tr>
                  <td colSpan="5" className="py-1.5 px-2 uppercase text-right border-r border-slate-400">
                    Total Keseluruhan
                  </td>
                  <td className="py-1.5 px-2 text-center border-r border-slate-400 font-mono">-{summary.total_quantity || 0} Unit</td>
                  <td className="py-1.5 px-2 border-r border-slate-400"></td>
                  <td className="py-1.5 px-2 text-right font-mono font-bold text-black">{formatRupiah(summary.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

      </div>

      {/* ========================================================
          LEMBAR PENGESAHAN & TANDA TANGAN (Visible ONLY on print)
          ======================================================== */}
      <div className="hidden print:grid grid-cols-2 gap-8 text-[10px] pt-4 border-t border-slate-400">
        <div className="text-center space-y-12">
          <div>
            <span className="block text-slate-600">Dibuat Oleh,</span>
            <strong className="block text-black font-semibold">Petugas Admin Gudang</strong>
          </div>
          <div className="border-t border-black w-36 mx-auto pt-0.5">
            <span className="text-[9px] text-slate-600">( Petugas Admin )</span>
          </div>
        </div>

        <div className="text-center space-y-12">
          <div>
            <span className="block text-slate-600">
              Bandung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <strong className="block text-black font-semibold">Mengetahui / Menyetujui</strong>
          </div>
          <div className="border-t border-black w-36 mx-auto pt-0.5">
            <span className="text-[9px] text-black font-bold">( Owner / Pimpinan )</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AdminReportsPage;

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import {
  Printer,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

const AdminReportPrintPage = () => {
  const [searchParams] = useSearchParams();

  const reportType = searchParams.get('type') || 'INVENTORY'; // 'INVENTORY', 'IN', 'OUT'
  const brandId = searchParams.get('brand_id') || '';
  const categoryId = searchParams.get('category_id') || '';
  const conditionType = searchParams.get('condition_type') || '';
  const status = searchParams.get('status') || '';
  const startDate = searchParams.get('start_date') || '';
  const endDate = searchParams.get('end_date') || '';

  const [reportData, setReportData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [reportType, brandId, categoryId, conditionType, status, startDate, endDate]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      let endpoint = '/reports/inventory';
      const params = {};

      if (reportType === 'INVENTORY') {
        endpoint = '/reports/inventory';
        if (brandId) params.brand_id = brandId;
        if (categoryId) params.category_id = categoryId;
        if (conditionType) params.condition_type = conditionType;
        if (status) params.status = status;
      } else if (reportType === 'IN') {
        endpoint = '/reports/transactions-in';
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (brandId) params.brand_id = brandId;
        if (conditionType) params.condition_type = conditionType;
      } else if (reportType === 'OUT') {
        endpoint = '/reports/transactions-out';
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (brandId) params.brand_id = brandId;
        if (conditionType) params.condition_type = conditionType;
      }

      const res = await api.get(endpoint, { params });
      if (res.data?.success) {
        setReportData(res.data.data || []);
        setSummary(res.data.summary || {});
      }
    } catch (err) {
      console.error('Error loading printable report data:', err);
    } finally {
      setLoading(false);
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
      year: 'numeric'
    });
  };

  const getReportTitle = () => {
    if (reportType === 'INVENTORY') return 'LAPORAN REKAPITULASI STOK INVENTARIS LAPTOP';
    if (reportType === 'IN') return 'LAPORAN REKAPITULASI MUTASI BARANG MASUK (PENGADAAN)';
    return 'LAPORAN REKAPITULASI MUTASI PENJUALAN BARANG KELUAR';
  };

  return (
    <div className="min-h-screen bg-slate-200/70 print:bg-white text-black font-sans antialiased py-6 px-4 print:p-0">
      
      {/* Print styles injection for 100% pixel-perfect print & PDF generation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 10mm 12mm 10mm;
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print {
            display: none !important;
          }
          .printable-sheet {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          table {
            page-break-inside: auto;
            border-collapse: collapse !important;
            width: 100% !important;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }
      `}} />

      {/* Screen Toolbar (Hidden on print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-300 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/reports"
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Laporan</span>
          </Link>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Halaman Cetak Laporan</h1>
            <p className="text-[11px] text-slate-500">Pratinjau cetak A4 sama persis dengan hasil cetak printer / PDF.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReportData}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF Sekarang</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Canvas */}
      <div className="printable-sheet max-w-4xl mx-auto bg-white p-8 sm:p-10 rounded-xl border border-slate-300 shadow-lg text-black text-xs leading-normal">
        
        {/* 1. KOP SURAT RESMI */}
        <div className="border-b-2 border-black pb-3 mb-5">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-black tracking-tight uppercase text-black">
                DHAFI KOMPUTER BANDUNG
              </h1>
              <p className="text-[11px] text-slate-800 leading-snug mt-0.5 max-w-lg">
                Pusat Inventaris & Penjualan Laptop Baru & Second Terpercaya<br />
                Bandung Electronics Center, Bandung BEC, Blk. F No.17a Lt.1, Babakan Ciamis, Kec. Sumur Bandung, Kota Bandung, Jawa Barat 40117<br />
                Telp / WhatsApp: 0896-0903-3525 | Email: dhafionline18@gmail.com
              </p>
            </div>
            <div className="text-right text-[11px]">
              <span className="font-bold uppercase block text-slate-600">Dokumen Laporan</span>
              <span className="font-mono font-bold text-black text-xs">
                DOC-{reportType}-{Date.now().toString().slice(-6)}
              </span>
              <span className="text-slate-600 block mt-0.5">
                Tgl Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* 2. JUDUL DOKUMEN & PERIODE */}
        <div className="text-center mb-5 space-y-1">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-black underline underline-offset-4">
            {getReportTitle()}
          </h2>
          {(startDate || endDate) && (
            <p className="text-[11px] text-slate-700 font-medium pt-0.5">
              Periode: {startDate ? formatDate(startDate) : 'Awal'} s/d {endDate ? formatDate(endDate) : 'Hari Ini'}
            </p>
          )}
        </div>

        {/* 3. RINGKASAN EKSEKUTIF (SUMMARY BOX) */}
        {summary && (
          <div className="mb-5 p-3 rounded-lg border border-slate-400 bg-slate-50 text-[11px]">
            <span className="font-bold text-slate-800 uppercase tracking-wider block mb-1.5 text-[10px]">
              Ringkasan Rekapitulasi:
            </span>
            {reportType === 'INVENTORY' && (
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-600 block text-[10px]">Total Model</span>
                  <strong className="font-mono text-xs text-black">{summary.total_items || 0} Model</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Stok Display</span>
                  <strong className="font-mono text-xs text-black">{summary.total_display_stock || 0} Unit</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Stok Fisik Gudang</span>
                  <strong className="font-mono text-xs text-black">{summary.total_physical_stock || 0} Unit</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Total Valuasi Aset</span>
                  <strong className="font-mono text-xs text-black">{formatRupiah(summary.total_asset_value)}</strong>
                </div>
              </div>
            )}

            {reportType === 'IN' && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-600 block text-[10px]">Total Transaksi</span>
                  <strong className="font-mono text-xs text-black">{summary.total_records || 0} Trx</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Total Unit Masuk</span>
                  <strong className="font-mono text-xs text-black">+{summary.total_quantity || 0} Unit</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Total Biaya Pengadaan</span>
                  <strong className="font-mono text-xs text-black">{formatRupiah(summary.total_amount)}</strong>
                </div>
              </div>
            )}

            {reportType === 'OUT' && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-600 block text-[10px]">Total Transaksi</span>
                  <strong className="font-mono text-xs text-black">{summary.total_records || 0} Trx</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Total Unit Terjual</span>
                  <strong className="font-mono text-xs text-black">-{summary.total_quantity || 0} Unit</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Total Omzet Penjualan</span>
                  <strong className="font-mono text-xs text-black">{formatRupiah(summary.total_amount)}</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. TABEL RINCIAN DATA LAPORAN */}
        <div className="mb-6">
          {reportType === 'INVENTORY' && (
            <table className="w-full text-left text-[11px] border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-200 text-black font-bold border-b border-slate-400 text-[10px] uppercase">
                  <th className="py-2 px-2.5 border-r border-slate-400 text-center w-8">No</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 w-24">Kode SKU</th>
                  <th className="py-2 px-2.5 border-r border-slate-400">Model Laptop</th>
                  <th className="py-2 px-2.5 border-r border-slate-400">Merek & Kategori</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 text-center w-16">Kondisi</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 text-right w-24">Harga Modal</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 text-right w-24">Harga Jual</th>
                  <th className="py-2 px-2 border-r border-slate-400 text-center w-12">Display</th>
                  <th className="py-2 px-2 border-r border-slate-400 text-center w-12">Fisik</th>
                  <th className="py-2 px-2.5 text-right w-28">Total Valuasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {loading ? (
                  <tr><td colSpan="10" className="py-6 text-center text-slate-500">Memuat data laporan...</td></tr>
                ) : reportData.length === 0 ? (
                  <tr><td colSpan="10" className="py-6 text-center text-slate-500">Tidak ada data stok inventaris sesuai filter.</td></tr>
                ) : (
                  reportData.map((row, i) => (
                    <tr key={row.id} className="border-b border-slate-300">
                      <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono text-[10px]">{i + 1}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 font-mono font-bold">{row.code}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 font-semibold">{row.name}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300">{row.brand_name} · {row.category_name}</td>
                      <td className="py-1.5 px-2 border-r border-slate-300 text-center">{row.condition_type}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 text-right font-mono">{formatRupiah(row.purchase_price)}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 text-right font-mono font-bold">{formatRupiah(row.selling_price)}</td>
                      <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono">{row.display_stock}</td>
                      <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono font-bold">{row.physical_stock}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono font-bold">{formatRupiah(row.total_asset_value)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-slate-200 font-bold border-t-2 border-black text-[11px]">
                <tr>
                  <td colSpan="7" className="py-2 px-2.5 uppercase text-right border-r border-slate-400">
                    Total Keseluruhan
                  </td>
                  <td className="py-2 px-2 text-center border-r border-slate-400 font-mono">{summary.total_display_stock || 0}</td>
                  <td className="py-2 px-2 text-center border-r border-slate-400 font-mono">{summary.total_physical_stock || 0}</td>
                  <td className="py-2 px-2.5 text-right font-mono font-bold text-black">{formatRupiah(summary.total_asset_value)}</td>
                </tr>
              </tfoot>
            </table>
          )}

          {reportType === 'IN' && (
            <table className="w-full text-left text-[11px] border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-200 text-black font-bold border-b border-slate-400 text-[10px] uppercase">
                  <th className="py-2 px-2.5 border-r border-slate-400 text-center w-8">No</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 w-24">Tanggal</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 w-28">No. Transaksi</th>
                  <th className="py-2 px-2.5 border-r border-slate-400">Sumber Pengadaan</th>
                  <th className="py-2 px-2.5 border-r border-slate-400">Model Laptop</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 text-center w-16">Jumlah</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 text-right w-28">Harga Beli</th>
                  <th className="py-2 px-2.5 text-right w-28">Subtotal Biaya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {loading ? (
                  <tr><td colSpan="8" className="py-6 text-center text-slate-500">Memuat data laporan...</td></tr>
                ) : reportData.length === 0 ? (
                  <tr><td colSpan="8" className="py-6 text-center text-slate-500">Tidak ada data transaksi masuk sesuai filter.</td></tr>
                ) : (
                  reportData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-300">
                      <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono text-[10px]">{i + 1}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 font-mono">{formatDate(row.transaction_date)}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 font-mono font-bold">{row.transaction_code}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300">{row.source_destination || '-'}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 font-semibold">{row.laptop_name}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 text-center font-mono font-bold">+{row.quantity} Unit</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 text-right font-mono">{formatRupiah(row.unit_price)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono font-bold">{formatRupiah(row.subtotal)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-slate-200 font-bold border-t-2 border-black text-[11px]">
                <tr>
                  <td colSpan="5" className="py-2 px-2.5 uppercase text-right border-r border-slate-400">
                    Total Keseluruhan
                  </td>
                  <td className="py-2 px-2.5 text-center border-r border-slate-400 font-mono">+{summary.total_quantity || 0} Unit</td>
                  <td className="py-2 px-2.5 border-r border-slate-400"></td>
                  <td className="py-2 px-2.5 text-right font-mono font-bold text-black">{formatRupiah(summary.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
          )}

          {reportType === 'OUT' && (
            <table className="w-full text-left text-[11px] border border-slate-400 border-collapse">
              <thead>
                <tr className="bg-slate-200 text-black font-bold border-b border-slate-400 text-[10px] uppercase">
                  <th className="py-2 px-2.5 border-r border-slate-400 text-center w-8">No</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 w-24">Tanggal</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 w-28">No. Faktur</th>
                  <th className="py-2 px-2.5 border-r border-slate-400">Customer / Tujuan</th>
                  <th className="py-2 px-2.5 border-r border-slate-400">Model Laptop</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 text-center w-16">Jumlah</th>
                  <th className="py-2 px-2.5 border-r border-slate-400 text-right w-28">Harga Jual</th>
                  <th className="py-2 px-2.5 text-right w-28">Total Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                {loading ? (
                  <tr><td colSpan="8" className="py-6 text-center text-slate-500">Memuat data laporan...</td></tr>
                ) : reportData.length === 0 ? (
                  <tr><td colSpan="8" className="py-6 text-center text-slate-500">Tidak ada data transaksi keluar sesuai filter.</td></tr>
                ) : (
                  reportData.map((row, i) => (
                    <tr key={i} className="border-b border-slate-300">
                      <td className="py-1.5 px-2 border-r border-slate-300 text-center font-mono text-[10px]">{i + 1}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 font-mono">{formatDate(row.transaction_date)}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 font-mono font-bold">{row.transaction_code}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300">{row.source_destination || '-'}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 font-semibold">{row.laptop_name}</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 text-center font-mono font-bold">-{row.quantity} Unit</td>
                      <td className="py-1.5 px-2.5 border-r border-slate-300 text-right font-mono">{formatRupiah(row.unit_price)}</td>
                      <td className="py-1.5 px-2.5 text-right font-mono font-bold">{formatRupiah(row.subtotal)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-slate-200 font-bold border-t-2 border-black text-[11px]">
                <tr>
                  <td colSpan="5" className="py-2 px-2.5 uppercase text-right border-r border-slate-400">
                    Total Keseluruhan
                  </td>
                  <td className="py-2 px-2.5 text-center border-r border-slate-400 font-mono">-{summary.total_quantity || 0} Unit</td>
                  <td className="py-2 px-2.5 border-r border-slate-400"></td>
                  <td className="py-2 px-2.5 text-right font-mono font-bold text-black">{formatRupiah(summary.total_amount)}</td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* 5. LEMBAR PENGESAHAN & TANDA TANGAN */}
        <div className="grid grid-cols-2 gap-8 text-[11px] pt-4 border-t border-slate-400">
          <div className="text-center space-y-14">
            <div>
              <span className="block text-slate-600">Dibuat Oleh,</span>
              <strong className="block text-black font-semibold">Petugas Admin Gudang</strong>
            </div>
            <div className="border-t border-black w-36 mx-auto pt-0.5">
              <span className="text-[10px] text-slate-600">( Petugas Admin )</span>
            </div>
          </div>

          <div className="text-center space-y-14">
            <div>
              <span className="block text-slate-600">
                Bandung, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
              <strong className="block text-black font-semibold">Mengetahui / Menyetujui</strong>
            </div>
            <div className="border-t border-black w-36 mx-auto pt-0.5">
              <span className="text-[10px] text-black font-bold">( Owner / Pimpinan )</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminReportPrintPage;

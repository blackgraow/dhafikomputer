import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Laptop,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  FileText,
  LogOut,
  Menu,
  X,
  Tag,
  Layers,
  Building2,
  Store
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: 'MAIN',
      items: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'INVENTARIS',
      items: [
        { label: 'Data Laptop', path: '/admin/laptops', icon: Laptop }
      ]
    },
    {
      title: 'MASTER DATA',
      items: [
        { label: 'Merek', path: '/admin/master-data?tab=brands', icon: Tag },
        { label: 'Kategori', path: '/admin/master-data?tab=categories', icon: Layers },
        { label: 'Master Dealer', path: '/admin/master-data?tab=master-dealers', icon: Building2 },
        { label: 'Dealer', path: '/admin/master-data?tab=dealers', icon: Store }
      ]
    },
    {
      title: 'TRANSAKSI',
      items: [
        { label: 'Barang Masuk', path: '/admin/transactions/in', icon: ArrowDownLeft },
        { label: 'Barang Keluar', path: '/admin/transactions/out', icon: ArrowUpRight },
        { label: 'Riwayat Transaksi', path: '/admin/transactions/history', icon: History }
      ]
    },
    {
      title: 'LAPORAN',
      items: [
        { label: 'Laporan', path: '/admin/reports', icon: FileText }
      ]
    }
  ];

  // Helper to determine active state
  const isItemActive = (path) => {
    if (path === '/admin/transactions/in') {
      return location.pathname.startsWith('/admin/transactions/in') ||
        location.pathname.startsWith('/admin/transactions/masuk') ||
        (location.pathname === '/admin/transactions' && new URLSearchParams(location.search).get('tab') === 'in');
    }
    if (path === '/admin/transactions/out') {
      return location.pathname.startsWith('/admin/transactions/out') ||
        location.pathname.startsWith('/admin/transactions/keluar') ||
        (location.pathname === '/admin/transactions' && new URLSearchParams(location.search).get('tab') === 'out');
    }
    if (path === '/admin/transactions/history' || path.includes('tab=history')) {
      return location.pathname === '/admin/transactions' ||
        location.pathname.startsWith('/admin/transactions/history') ||
        location.pathname.startsWith('/admin/transactions/riwayat') ||
        (location.pathname === '/admin/transactions' && new URLSearchParams(location.search).get('tab') === 'history');
    }
    const [pathname, search] = path.split('?');
    if (search) {
      if (path.includes('tab=brands')) {
        return (location.pathname === '/admin/master-data' && (new URLSearchParams(location.search).get('tab') === 'brands' || !new URLSearchParams(location.search).get('tab'))) ||
          location.pathname.includes('/brands') ||
          location.pathname.includes('/master-data/brands');
      }
      if (path.includes('tab=categories')) {
        return (location.pathname === '/admin/master-data' && new URLSearchParams(location.search).get('tab') === 'categories') ||
          location.pathname.includes('/categories') ||
          location.pathname.includes('/master-data/categories');
      }
      if (path.includes('tab=master-dealers')) {
        return (location.pathname === '/admin/master-data' && new URLSearchParams(location.search).get('tab') === 'master-dealers') ||
          location.pathname.includes('/master-dealers') ||
          location.pathname.includes('/master-data/master-dealers');
      }
      if (path.includes('tab=dealers')) {
        return (location.pathname === '/admin/master-data' && new URLSearchParams(location.search).get('tab') === 'dealers') ||
          location.pathname.includes('/dealers') ||
          location.pathname.includes('/master-data/dealers');
      }
      return location.pathname === pathname && location.search === `?${search}`;
    }
    if (path === '/admin/laptops') {
      return location.pathname.startsWith('/admin/laptops');
    }
    return location.pathname === pathname && (!location.search || location.pathname === '/admin/dashboard');
  };

  // Helper to determine dynamic page title for Topbar
  const getPageTitle = () => {
    const pathname = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');

    if (pathname.includes('/admin/dashboard')) return 'Dashboard';
    if (pathname === '/admin/laptops/create' || pathname === '/admin/laptops/tambah') return 'Tambah Laptop Baru';
    if (pathname.includes('/brands') && (pathname.includes('/create') || pathname.includes('/tambah'))) return 'Tambah Merek';
    if (pathname.includes('/brands') && pathname.includes('/edit')) return 'Edit Merek';
    if (pathname.includes('/categories') && (pathname.includes('/create') || pathname.includes('/tambah'))) return 'Tambah Kategori';
    if (pathname.includes('/categories') && pathname.includes('/edit')) return 'Edit Kategori';
    if (pathname.includes('/master-dealers') && (pathname.includes('/create') || pathname.includes('/tambah'))) return 'Tambah Master Dealer';
    if (pathname.includes('/master-dealers') && pathname.includes('/edit')) return 'Edit Master Dealer';
    if (pathname.includes('/dealers') && (pathname.includes('/create') || pathname.includes('/tambah'))) return 'Tambah Dealer';
    if (pathname.includes('/dealers') && pathname.includes('/edit')) return 'Edit Dealer';
    if (pathname.startsWith('/admin/transactions/in') || pathname.startsWith('/admin/transactions/masuk')) return 'Transaksi Barang Masuk';
    if (pathname.startsWith('/admin/transactions/out') || pathname.startsWith('/admin/transactions/keluar')) return 'Transaksi Barang Keluar';
    if (pathname.startsWith('/admin/transactions/history') || pathname.startsWith('/admin/transactions/riwayat') || pathname === '/admin/transactions') return 'Riwayat Transaksi';
    if (pathname.includes('/laptops/') && pathname.includes('/edit')) return 'Edit Laptop';
    if (pathname.startsWith('/admin/laptops/') && pathname !== '/admin/laptops') return 'Detail Laptop';
    if (pathname.includes('/admin/laptops')) return 'Data Laptop';
    
    if (pathname.includes('/admin/master-data')) {
      if (pathname.includes('/brands/create') || pathname.includes('/brands/tambah')) return 'Tambah Merek';
      if (pathname.includes('/categories/create') || pathname.includes('/categories/tambah')) return 'Tambah Kategori';
      if (pathname.includes('/master-dealers/create') || pathname.includes('/master-dealers/tambah')) return 'Tambah Master Dealer';
      if (pathname.includes('/dealers/create') || pathname.includes('/dealers/tambah')) return 'Tambah Dealer';
      if (tab === 'brands') return 'Master Merek';
      if (tab === 'categories') return 'Master Kategori';
      if (tab === 'master-dealers') return 'Master Dealer';
      if (tab === 'dealers') return 'Dealer Toko Lain';
      return 'Master Data';
    }

    if (pathname.includes('/admin/transactions')) {
      if (tab === 'in') return 'Barang Masuk';
      if (tab === 'out') return 'Barang Keluar';
      if (tab === 'history') return 'Riwayat Transaksi';
      return 'Transaksi';
    }

    if (pathname.startsWith('/admin/reports/print') || pathname.startsWith('/admin/reports/cetak')) return 'Cetak Laporan';
    if (pathname.includes('/admin/reports')) return 'Laporan';

    return 'Admin Panel';
  };

  return (
    <div className="h-screen bg-[#F8FAFC] text-slate-900 flex flex-col md:flex-row font-sans selection:bg-blue-600 selection:text-white overflow-hidden print:h-auto print:overflow-visible print:bg-white print:block">
      
      {/* ========================================================
          1. FIXED DESKTOP SIDEBAR (Full height h-screen, fixed in place)
          ======================================================== */}
      <aside className="hidden md:flex flex-col w-[260px] h-screen bg-gradient-to-b from-[#071A3A] via-[#041026] to-[#020B1F] text-white flex-shrink-0 z-30 border-r border-slate-800/80 shadow-xl overflow-hidden print:hidden">
        
        {/* Brand Header (Fixed Top of Sidebar) */}
        <div className="p-5 border-b border-slate-800/80 flex-shrink-0">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-600/30 group-hover:bg-blue-500 transition-colors">
              DK
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white block">Dhafi Komputer</span>
              <span className="text-[11px] text-slate-400 font-medium block -mt-0.5">Inventory System</span>
            </div>
          </Link>
        </div>

        {/* Structured Menu (Independently Scrollable inside Sidebar if needed) */}
        <nav className="flex-1 p-3.5 space-y-4 overflow-y-auto">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {section.title}
              </span>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        active
                          ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30 ring-1 ring-blue-500/40'
                          : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer (Fixed Bottom of Sidebar) */}
        <div className="p-3.5 border-t border-slate-800/80 space-y-2 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          2. MOBILE NAVBAR & DRAWER
          ======================================================== */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40 flex-shrink-0 print:hidden">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
            DK
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block leading-tight">Dhafi Komputer</span>
            <span className="text-[10px] text-slate-500 block leading-tight">Inventory System</span>
          </div>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex print:hidden">
          <div className="w-4/5 max-w-xs bg-gradient-to-b from-[#071A3A] via-[#041026] to-[#020B1F] text-white h-full p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-5 overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                    DK
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block leading-tight">Dhafi Komputer</span>
                    <span className="text-[10px] text-slate-400 block leading-tight">Inventory System</span>
                  </div>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-4">
                {navSections.map((sec, idx) => (
                  <div key={idx} className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {sec.title}
                    </span>
                    <div className="space-y-0.5 mt-1">
                      {sec.items.map((it) => {
                        const Icon = it.icon;
                        const active = isItemActive(it.path);
                        return (
                          <Link
                            key={it.path}
                            to={it.path}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold ${
                              active ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{it.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-500/15 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* ========================================================
          3. INDEPENDENT SCROLLABLE MAIN VIEWPORT WITH FIXED TOPBAR
          ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden print:h-auto print:overflow-visible print:w-full print:block">
        
        {/* Desktop Fixed Topbar — Clean & Minimal */}
        <header className="hidden md:flex items-center h-16 px-6 lg:px-8 bg-white border-b border-slate-200/80 flex-shrink-0 z-20 shadow-xs print:hidden">
          <span className="text-sm font-bold text-slate-800">{getPageTitle()}</span>
        </header>

        {/* Scrollable Page Content Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 print:p-0 print:m-0 print:overflow-visible print:w-full print:block">
          <div className="max-w-[1400px] w-full mx-auto print:max-w-full print:w-full print:p-0 print:m-0">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;

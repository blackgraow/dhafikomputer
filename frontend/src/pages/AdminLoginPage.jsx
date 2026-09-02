import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  User,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  LogIn
} from 'lucide-react';

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Login gagal. Periksa username dan password Anda.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal terhubung ke server backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:grid lg:grid-cols-12 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================
          LEFT 50% — DARK NAVY BRANDING & VISUAL AREA (#0B1026)
          ======================================================== */}
      <div className="lg:col-span-6 bg-gradient-to-b from-[#07142F] via-[#0B1026] to-[#020617] text-white relative overflow-hidden flex flex-col justify-between p-8 sm:p-12 lg:p-14 border-b lg:border-b-0 lg:border-r border-slate-800/80">
        
        {/* Subtle Ambient Light Gradients */}
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-24 -ml-24 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Decorative Dot Grid in Bottom Right */}
        <div 
          className="absolute bottom-6 right-6 w-36 h-36 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#93c5fd 1.5px, transparent 1.5px)',
            backgroundSize: '14px 14px'
          }}
        />

        {/* Top: Dhafi Komputer Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3.5 group">
            {/* Geometric Brand Badge DK */}
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-lg shadow-blue-600/30 group-hover:bg-blue-500 transition-all duration-200">
              DK
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">Dhafi Komputer</span>
              <span className="text-xs text-slate-400 font-medium block">Inventory Management System</span>
            </div>
          </Link>
        </div>

        {/* Center: Large Laptop Visual & Hero Tagline */}
        <div className="relative z-10 my-8 lg:my-0 space-y-7 max-w-lg">
          
          {/* Laptop Showcase Visual Card
          <div className="relative rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 p-3 shadow-2xl backdrop-blur-sm">
            <div className="relative rounded-xl overflow-hidden aspect-16/10 bg-slate-950">
              <img
                src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=900&auto=format&fit=crop&q=80"
                alt="Dhafi Komputer Laptop Management Visual"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
            </div>
          </div> */}

          {/* Hero Heading & Subtitle */}
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-white tracking-tight leading-tight">
              Kelola inventaris laptop<br />
              <span className="text-blue-500">Dhafi Komputer</span> dengan mudah.
            </h2>
          </div>

        </div>

        {/* Bottom: Copyright Footer */}
        <div className="relative z-10 text-xs text-slate-500">
          <p>© 2026 Dhafi Komputer. All rights reserved.</p>
        </div>

      </div>

      {/* ========================================================
          RIGHT 50% — PURE WHITE ADMIN LOGIN FORM (#FFFFFF)
          ======================================================== */}
      <div className="lg:col-span-6 bg-white flex flex-col justify-between p-8 sm:p-12 lg:p-14 overflow-y-auto">
        
        {/* Top: Return to Website */}
        <div className="flex items-center justify-start">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website Publik</span>
          </Link>
        </div>

        {/* Center: Login Form Card */}
        <div className="my-8 lg:my-auto max-w-[420px] w-full mx-auto space-y-7">
          
          {/* Brand Logo & Headings */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm border border-blue-100 shadow-sm">
                DK
              </div>
              <span className="text-base font-bold text-slate-900">Dhafi Komputer</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F3A] tracking-tight">
                Selamat Datang Kembali
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Masuk ke sistem manajemen inventaris.
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Username</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100/60 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 h-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-100/60 transition-all placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
};

export default AdminLoginPage;

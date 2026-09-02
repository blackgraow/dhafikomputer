import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, Menu, X, Shield, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('beranda');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isCatalog = location.pathname === '/products' || location.pathname === '/katalog' || location.pathname === '/laptops';
    if (isCatalog) {
      setActiveSection('produk');
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Determine active section based on scroll position on home page
      const sections = ['beranda', 'tentang', 'produk', 'kontak'];
      const scrollPos = window.scrollY + 100;
      for (let s of sections) {
        const elem = document.getElementById(s);
        if (elem) {
          const top = elem.offsetTop;
          const height = elem.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(s);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (sectionId, directPath) => {
    setMobileMenuOpen(false);

    if (directPath) {
      navigate(directPath);
      window.scrollTo(0, 0);
      return;
    }

    setActiveSection(sectionId);
    if (location.pathname !== '/') {
      navigate('/#' + sectionId);
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -72;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' 
        : 'bg-white border-b border-slate-100'
    }`}>
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Dhafi Komputer Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Stylized DK Geometric Badge */}
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-base shadow-md shadow-blue-600/20 group-hover:bg-blue-700 transition-all">
              DK
            </div>
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-[#0B1F3A] uppercase block leading-tight">
                DHAFI KOMPUTER
              </span>
              <span className="text-[11px] text-slate-500 font-medium block leading-tight">
                Laptop Baru & Second
              </span>
            </div>
          </Link>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            
            {/* Beranda */}
            <button
              onClick={() => handleNavClick('beranda', location.pathname !== '/' ? '/' : null)}
              className={`relative py-2 transition-colors cursor-pointer ${
                activeSection === 'beranda' && location.pathname === '/' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <span>Beranda</span>
              {activeSection === 'beranda' && location.pathname === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            {/* Tentang Kami */}
            <button
              onClick={() => handleNavClick('tentang')}
              className={`relative py-2 transition-colors cursor-pointer ${
                activeSection === 'tentang' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <span>Tentang Kami</span>
              {activeSection === 'tentang' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

            {/* Produk (Navigates directly to /products catalog page) */}
            <Link
              to="/products"
              className={`relative py-2 transition-colors cursor-pointer ${
                location.pathname === '/products' || location.pathname === '/katalog' || activeSection === 'produk'
                  ? 'text-blue-600 font-semibold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <span>Produk</span>
              {(location.pathname === '/products' || location.pathname === '/katalog' || activeSection === 'produk') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </Link>

            {/* Kontak */}
            <button
              onClick={() => handleNavClick('kontak')}
              className={`relative py-2 transition-colors cursor-pointer ${
                activeSection === 'kontak' ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <span>Kontak</span>
              {activeSection === 'kontak' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>

          </nav>

          {/* Right: Login Admin Action */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-semibold text-xs transition-colors"
              >
                <Shield className="w-4 h-4 text-blue-600" />
                <span>Panel Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold text-xs shadow-sm shadow-blue-600/20 transition-all hover:scale-102"
              >
                <User className="w-4 h-4 text-white" />
                <span>Login Admin</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <button
            onClick={() => handleNavClick('beranda', '/')}
            className={`block w-full text-left px-3 py-2 rounded-lg font-semibold text-sm ${
              activeSection === 'beranda' && location.pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => handleNavClick('tentang')}
            className={`block w-full text-left px-3 py-2 rounded-lg font-semibold text-sm ${
              activeSection === 'tentang' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Tentang Kami
          </button>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className={`block w-full text-left px-3 py-2 rounded-lg font-semibold text-sm ${
              location.pathname === '/products' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Produk
          </Link>
          <button
            onClick={() => handleNavClick('kontak')}
            className={`block w-full text-left px-3 py-2 rounded-lg font-semibold text-sm ${
              activeSection === 'kontak' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Kontak
          </button>
          
          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-50 text-blue-700 font-semibold text-xs border border-blue-200"
              >
                <Shield className="w-4 h-4" />
                <span>Panel Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-sm"
              >
                <User className="w-4 h-4" />
                <span>Login Admin</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

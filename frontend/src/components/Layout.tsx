import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Search, Menu, X, Heart, MessageCircle, Store, LogOut, User, ChevronDown } from 'lucide-react';

export function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [dropOpen,    setDropOpen]    = useState(false);

  const nav = [
    { to: '/browse',    label: 'Browse' },
    { to: '/post-shop', label: 'Post Shop' },
    { to: '/my-shop',   label: 'My Shop' },
    { to: '/messages',  label: 'Messages' },
  ];

  const isActive = (p: string) => location.pathname === p || location.pathname.startsWith(p + '/');

  const handleLogout = () => { logout(); navigate('/'); setDropOpen(false); };

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-cav-green-accent/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cav-green-dark to-cav-green flex items-center justify-center shadow-sm">
              <ShoppingBag size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display font-800 text-base leading-none text-cav-green-dark">CavSulit</div>
              <div className="text-[9px] text-cav-text-muted font-medium leading-none mt-0.5">CVSU Marketplace</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {nav.map(n => (
              <Link key={n.to} to={n.to}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150
                  ${isActive(n.to) ? 'bg-cav-green text-white' : 'text-cav-text-muted hover:text-cav-green hover:bg-cav-green-accent/10'}`}>
                {n.label}
              </Link>
            ))}
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link to="/wishlist" className="btn-ghost hidden sm:flex"><Heart size={16}/></Link>
                <div className="relative">
                  <button onClick={() => setDropOpen(!dropOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-cav-green-accent/10 transition-all">
                    <div className="w-7 h-7 rounded-full bg-cav-green flex items-center justify-center text-white text-xs font-bold">
                      {user.fullName?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-cav-green-dark hidden sm:block">{user.fullName?.split(' ')[0]}</span>
                    <ChevronDown size={14} className="text-cav-text-muted hidden sm:block"/>
                  </button>
                  {dropOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <div className="font-bold text-sm text-cav-green-dark">{user.fullName}</div>
                        <div className="text-xs text-cav-text-muted">{user.email}</div>
                      </div>
                      <Link to="/my-shop"  onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"><Store size={14}/> My Shop</Link>
                      <Link to="/wishlist" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors"><Heart size={14}/> Wishlist</Link>
                      <Link to="/verified" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50 transition-colors">⭐ My Badge</Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full transition-colors"><LogOut size={14}/> Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login"    className="btn-ghost text-sm hidden sm:flex">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden btn-ghost p-2">
              {menuOpen ? <X size={20}/> : <Menu size={20}/>}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-1">
            {nav.map(n => (
              <Link key={n.to} to={n.to} onClick={() => setMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold ${isActive(n.to) ? 'bg-cav-green text-white' : 'text-cav-text-muted'}`}>
                {n.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-1 min-h-0"><Outlet /></main>

      <footer className="bg-cav-green-dark text-white/80 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center"><ShoppingBag size={14} className="text-white"/></div>
            <span className="font-display font-bold text-white">CavSulit</span>
          </div>
          <div className="text-xs text-center">© 2026 CavSulit · ITEC Group 3 · Cavite State University</div>
          <div className="text-xs">cavsulit.com</div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState } from 'react';
import { Shield, AlertTriangle, UserCheck, Menu, X, LogOut, CheckCircle, Download } from 'lucide-react';
import { AdminUser } from '../types/roleplay';
import infinityLogo from '../assets/images/infinity_logo.png';

interface NavbarProps {
  activeTab: 'factions' | 'complaints' | 'admin';
  setActiveTab: (tab: 'factions' | 'complaints' | 'admin') => void;
  adminUser: AdminUser | null;
  onOpenAdminLogin: () => void;
  onAdminLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  adminUser,
  onOpenAdminLogin,
  onAdminLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'factions' | 'complaints' | 'admin') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const APK_DOWNLOAD_URL = "https://www.dropbox.com/scl/fi/kygvl9xizmso7cmn1kbvl/Infinity-Mobile-RP.apk?rlkey=78vyq949lt9itvv9cn1dnqest&st=um3ltccj&dl=1";

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element brand wordmark with attached logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => handleNavClick('factions')} 
              className="flex items-center gap-3 text-left focus:outline-none group"
            >
              <img
                src={infinityLogo}
                alt="Infinity Mobile Logo"
                className="w-9 h-9 rounded-xl object-cover border border-neutral-800 shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform"
              />
              <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
                Infinity Mobile
              </span>
            </button>
          </div>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => handleNavClick('factions')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'factions'
                  ? 'text-cyan-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Factions</span>
            </button>

            <button
              onClick={() => handleNavClick('complaints')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'complaints'
                  ? 'text-cyan-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Player Complaints</span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap py-1 ${
                activeTab === 'admin'
                  ? 'text-cyan-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Administration</span>
            </button>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Game Download Link */}
            <a
              href={APK_DOWNLOAD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-400/20 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Download APK</span>
            </a>

            {adminUser ? (
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-neutral-300 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-medium text-emerald-400">{adminUser.role}</span>
                  <span className="text-neutral-500 font-mono">({adminUser.username})</span>
                </div>
                <button
                  onClick={onAdminLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 border border-neutral-800 rounded-lg transition-colors whitespace-nowrap"
                  title="Sign out of administration"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Admin Sign In</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-400 hover:text-white md:hidden rounded-lg hover:bg-neutral-900 border border-neutral-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-800 bg-neutral-950/95 px-4 pt-3 pb-5 space-y-2">
          {/* Direct APK Download Banner on Mobile */}
          <a
            href={APK_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-neutral-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Download Game APK</span>
          </a>

          <button
            onClick={() => handleNavClick('factions')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
              activeTab === 'factions'
                ? 'bg-neutral-900 text-cyan-400 border border-neutral-800'
                : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>All Factions</span>
          </button>

          <button
            onClick={() => handleNavClick('complaints')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
              activeTab === 'complaints'
                ? 'bg-neutral-900 text-cyan-400 border border-neutral-800'
                : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Player Complaints Panel</span>
          </button>

          <button
            onClick={() => handleNavClick('admin')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
              activeTab === 'admin'
                ? 'bg-neutral-900 text-cyan-400 border border-neutral-800'
                : 'text-neutral-300 hover:bg-neutral-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Administration Dashboard</span>
          </button>

          <div className="pt-2 border-t border-neutral-800">
            {adminUser ? (
              <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                <div className="text-xs">
                  <p className="font-semibold text-emerald-400">{adminUser.role}</p>
                  <p className="text-neutral-400 font-mono">{adminUser.username}</p>
                </div>
                <button
                  onClick={() => {
                    onAdminLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 rounded-md"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAdminLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-lg"
              >
                <UserCheck className="w-4 h-4" />
                <span>Admin Sign In</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

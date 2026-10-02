import React from 'react';
import { Sparkles, Crown, CloudSun, User as UserIcon, LogOut, Key, Database } from 'lucide-react';
import { UserProfile, NavPage } from '../types';

interface NavbarProps {
  profile: UserProfile;
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
  onOpenVipModal: () => void;
  onOpenAuthModal: () => void;
  onOpenApiKeyModal: () => void;
  onOpenDatabaseModal: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  currentPage,
  onNavigate,
  onOpenVipModal,
  onOpenAuthModal,
  onOpenApiKeyModal,
  onOpenDatabaseModal,
  onSignOut,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/5 px-4 sm:px-8 py-3 transition-all duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="cursor-pointer group flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-noir-800 to-noir-900 border border-gold-500/30 flex items-center justify-center shadow-luxury group-hover:border-gold-400/60 transition-all">
            <span className="font-serif font-black text-xl gold-gradient-text tracking-tighter">N</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-widest text-silk-100 group-hover:text-gold-300 transition-colors">
                NIKA
              </span>
              <span className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded bg-white/5 text-gold-400/90 border border-gold-500/20">
                AI STYLIST
              </span>
            </div>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-silk-500 hidden sm:block">
              MILAN · PARIS · NEW YORK
            </p>
          </div>
        </div>

        {/* Center: Live Climate & Location */}
        <div className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-noir-900/80 border border-white/5 text-xs text-silk-300 font-mono">
          <CloudSun className="w-3.5 h-3.5 text-gold-400" />
          <span>{profile.location}</span>
          <span className="w-1 h-1 rounded-full bg-silk-500" />
          <span className="text-silk-100 font-medium">18°C Mild Breeze</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Database Inspector Button */}
          <button
            onClick={onOpenDatabaseModal}
            className="p-2 rounded-xl bg-noir-850 hover:bg-gold-500/10 text-silk-400 hover:text-gold-300 border border-white/5 hover:border-gold-500/30 transition-all text-xs font-mono flex items-center gap-1.5"
            title="Inspect Database & Collections"
          >
            <Database className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden xl:inline text-[11px]">Database</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenApiKeyModal}
            className="p-2 rounded-xl bg-noir-850 hover:bg-gold-500/10 text-silk-400 hover:text-gold-300 border border-white/5 hover:border-gold-500/30 transition-all text-xs font-mono flex items-center gap-1.5"
            title="Configure Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden xl:inline text-[11px]">API Key</span>
          </button>

          {/* Atelier VIP Button */}
          <button
            onClick={onOpenVipModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-gold-500/10 to-gold-400/20 hover:from-gold-500/20 hover:to-gold-400/30 border border-gold-500/30 text-xs text-gold-300 font-medium transition-all shadow-sm hover:scale-[1.02]"
          >
            <Crown className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">NIKA Atelier</span>
            <span className="sm:hidden font-mono text-[10px]">VIP</span>
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
            title="Profile & Style DNA"
          >
            <div className="relative">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-8 h-8 rounded-full object-cover border border-gold-500/40"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-noir-950" />
            </div>
            <span className="text-xs text-silk-300 font-medium hidden lg:inline max-w-[90px] truncate">
              {profile.name.split(' ')[0]}
            </span>
          </button>

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className="p-2 rounded-xl bg-noir-850 hover:bg-rose-950/40 text-silk-400 hover:text-rose-300 border border-white/5 hover:border-rose-500/30 transition-all text-xs font-mono flex items-center gap-1"
            title="Sign Out from Atelier"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

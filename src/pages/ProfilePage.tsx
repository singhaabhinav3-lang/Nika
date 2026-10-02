import React, { useState } from 'react';
import {
  User,
  Crown,
  Settings,
  Database,
  Bookmark,
  Sparkles,
  Download,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { UserProfile, Outfit, NavPage } from '../types';
import { storageService } from '../services/storageService';

interface ProfilePageProps {
  profile: UserProfile;
  savedOutfits: Outfit[];
  onOpenAuthModal: () => void;
  onOpenVipModal: () => void;
  onOpenOutfit: (outfit: Outfit) => void;
  onDeleteOutfit: (id: string) => void;
  onSignOut?: () => void;
  onOpenDatabaseModal?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  savedOutfits,
  onOpenAuthModal,
  onOpenVipModal,
  onOpenOutfit,
  onDeleteOutfit,
  onSignOut,
  onOpenDatabaseModal,
}) => {
  const [activeTab, setActiveTab] = useState<'lookbook' | 'dna' | 'database'>('lookbook');
  const [copiedSql, setCopiedSql] = useState(false);

  const postgresSql = storageService.getPostgresSchemaSql();

  const handleDownloadBackup = () => {
    const data = {
      profile,
      savedOutfits,
      wardrobe: storageService.getWardrobe(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nika-wardrobe-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopySql = () => {
    navigator.clipboard?.writeText(postgresSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-fade-in">
      {/* Profile Header Card */}
      <section className="relative rounded-3xl p-6 sm:p-8 glass-panel-gold border border-gold-500/30 shadow-2xl flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="relative">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gold-500/50 shadow-luxury"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-noir-900 border border-gold-500/40 flex items-center justify-center text-gold-400">
              <Crown className="w-3.5 h-3.5" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-silk-100">
                {profile.name}
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/40">
                {profile.vipTier}
              </span>
            </div>

            <p className="text-xs text-silk-400 font-mono mt-1">
              {profile.email} · {profile.location}
            </p>
            <p className="text-[11px] text-silk-500 mt-1">
              Member of NIKA Atelier since {profile.memberSince}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-4 mt-4 pt-3 border-t border-white/5 text-xs">
              <div>
                <span className="font-bold text-silk-100 font-mono">{savedOutfits.length}</span>{' '}
                <span className="text-silk-400">Outfits</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-silk-600" />
              <div>
                <span className="font-bold text-silk-100 font-mono">
                  {profile.stats.totalClosetPieces}
                </span>{' '}
                <span className="text-silk-400">Pieces</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-silk-600" />
              <div>
                <span className="font-bold text-emerald-400 font-mono">
                  {profile.stats.wardrobeUtilization}%
                </span>{' '}
                <span className="text-silk-400">Utilization</span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit & VIP Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-noir-850 hover:bg-white/5 border border-white/10 text-xs font-mono text-silk-200 transition-colors flex items-center justify-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={onOpenVipModal}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-luxury-glow flex items-center justify-center gap-1.5"
          >
            <Crown className="w-3.5 h-3.5" />
            <span>Atelier Perks</span>
          </button>

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-noir-850 hover:bg-rose-950/40 text-silk-400 hover:text-rose-300 border border-white/10 hover:border-rose-500/30 text-xs font-mono transition-colors flex items-center justify-center gap-1.5"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </section>

      {/* Tabs Switcher */}
      <section className="flex items-center gap-2 border-b border-white/10 pb-2">
        {[
          { id: 'lookbook', label: `Saved Lookbook (${savedOutfits.length})`, icon: Bookmark },
          { id: 'dna', label: 'Style DNA & Sizing', icon: Sparkles },
          { id: 'database', label: 'PostgreSQL & Cloud Sync', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-gold-500/20 text-gold-300 border border-gold-500/40 font-bold'
                  : 'text-silk-400 hover:text-silk-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </section>

      {/* Tab 1: Lookbook */}
      {activeTab === 'lookbook' && (
        <section className="space-y-4">
          {savedOutfits.length === 0 ? (
            <div className="p-12 rounded-3xl bg-noir-900 border border-white/10 text-center space-y-3">
              <Bookmark className="w-8 h-8 text-silk-500 mx-auto" />
              <h3 className="text-base font-serif font-bold text-silk-100">
                Your Lookbook is Empty
              </h3>
              <p className="text-xs text-silk-400">
                Generate an outfit and tap the heart icon to save looks to your personal portfolio.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  onClick={() => onOpenOutfit(outfit)}
                  className="group cursor-pointer rounded-2xl bg-noir-900 border border-white/10 hover:border-gold-500/40 p-5 transition-all shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-silk-400 mb-2">
                      <span className="text-gold-400">{outfit.occasion}</span>
                      <span>{outfit.confidenceScore}% VIBE MATCH</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-silk-100 group-hover:text-gold-200 transition-colors">
                      {outfit.title}
                    </h3>
                    <p className="text-xs text-silk-400 line-clamp-1 mt-1 font-serif italic">
                      "{outfit.tagline}"
                    </p>

                    {/* Pieces thumbnails */}
                    <div className="flex items-center gap-2 mt-4">
                      {[
                        outfit.pieces.top || outfit.pieces.dress,
                        outfit.pieces.bottom || outfit.pieces.outerwear,
                        outfit.pieces.shoes,
                      ]
                        .filter(Boolean)
                        .map((p, i) => (
                          <div
                            key={i}
                            className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/10"
                          >
                            <img src={p!.imageUrl} alt={p!.name} className="w-full h-full object-cover" />
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-silk-500 font-mono text-[10px]">{outfit.savedAt}</span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteOutfit(outfit.id);
                      }}
                      className="p-1.5 rounded-lg text-silk-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                      title="Remove from Lookbook"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Style DNA */}
      {activeTab === 'dna' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Aesthetics */}
            <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
                Core Aesthetic Profile
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.styleAesthetics.map((aes) => (
                  <span
                    key={aes}
                    className="px-3 py-1.5 rounded-full bg-gold-500/10 text-gold-300 border border-gold-500/30 text-xs font-medium"
                  >
                    {aes}
                  </span>
                ))}
              </div>
              <p className="text-xs text-silk-400 leading-relaxed">
                Prioritizes clean architectural lines, muted neutral palettes, and relaxed
                menswear-inspired tailoring.
              </p>
            </div>

            {/* Color Season */}
            <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
                Color Season Calibration
              </h3>
              <div className="text-sm font-semibold text-silk-100 font-serif">
                {profile.colorSeason}
              </div>
              <p className="text-xs text-silk-400 leading-relaxed">
                Flattered by rich warm camel, chocolate espresso, brushed 18k gold, and raw indigo.
                Avoid stark optical neons.
              </p>

              <div className="flex items-center gap-2 pt-2">
                {profile.favoriteColors.map((hex, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* Sizing & Fit */}
            <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
                Body & Silhouette Sizing
              </h3>
              <div className="space-y-2 text-xs font-mono text-silk-300">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-silk-500">Tops & Knitwear</span>
                  <span className="text-silk-100">{profile.sizing.top}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-silk-500">Trousers & Skirts</span>
                  <span className="text-silk-100">{profile.sizing.bottom}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-silk-500">Footwear</span>
                  <span className="text-silk-100">{profile.sizing.shoes}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-silk-500">Fit Philosophy</span>
                  <span className="text-gold-300">{profile.sizing.fitPreference}</span>
                </div>
              </div>
            </div>

            {/* Budget Calibration */}
            <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 space-y-3">
              <h3 className="text-xs font-mono uppercase tracking-wider text-gold-400">
                Shopping & Retail Calibration
              </h3>
              <div className="text-sm font-semibold text-silk-100">
                {profile.budgetTier}
              </div>
              <p className="text-xs text-silk-400 leading-relaxed">
                Preferred retailers: The Row, Totême, Khaite, COS Atelier, SSENSE, Net-A-Porter.
              </p>
              <div className="p-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-xs text-gold-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Active 15% VIP partner discount unlocked</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tab 3: PostgreSQL Database Schema & Backup */}
      {activeTab === 'database' && (
        <section className="space-y-6">
          <div className="p-6 rounded-3xl bg-noir-900 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                    PostgreSQL Database Connected
                  </span>
                </div>
                <h3 className="text-lg font-serif font-bold text-silk-100 mt-1">
                  Relational Storage & Schema
                </h3>
                <p className="text-xs text-silk-400">
                  Production PostgreSQL schema storing Users, Outfits, and Wardrobe Items with
                  JSONB pieces breakdown.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {onOpenDatabaseModal && (
                  <button
                    onClick={onOpenDatabaseModal}
                    className="px-3.5 py-1.5 rounded-xl bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/40 text-xs font-mono text-gold-300 font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Open Interactive Database Explorer</span>
                  </button>
                )}

                <button
                  onClick={handleCopySql}
                  className="px-3.5 py-1.5 rounded-xl bg-noir-850 hover:bg-white/10 border border-white/10 text-xs font-mono text-silk-200 transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
                </button>

                <button
                  onClick={handleDownloadBackup}
                  className="px-4 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-semibold text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON Backup</span>
                </button>
              </div>
            </div>

            {/* SQL Code Block */}
            <div className="p-4 rounded-2xl bg-noir-950 border border-white/10 overflow-x-auto">
              <pre className="text-[11px] font-mono text-silk-300 leading-relaxed">
                {postgresSql}
              </pre>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

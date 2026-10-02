import React, { useState } from 'react';
import {
  X,
  Database,
  Download,
  Upload,
  RefreshCw,
  Trash2,
  Table,
  CheckCircle2,
  Layers,
  Users,
  Shirt,
  Sparkles,
  FileCode2,
  Copy,
  Check
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { firebaseAuthService } from '../services/firebase';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

type TabType = 'overview' | 'wardrobe' | 'outfits' | 'accounts' | 'schema';

export const DatabaseModal: React.FC<DatabaseModalProps> = ({
  isOpen,
  onClose,
  onDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const wardrobe = storageService.getWardrobe();
  const outfits = storageService.getSavedOutfits();
  const profile = storageService.getProfile();

  let accounts: any[] = [];
  try {
    const rawAcc = localStorage.getItem('nika_registered_accounts');
    if (rawAcc) accounts = JSON.parse(rawAcc);
  } catch (e) {
    accounts = [];
  }

  // Export database as JSON
  const handleExportJson = () => {
    const fullDb = {
      exportedAt: new Date().toISOString(),
      appName: 'NIKA Fashion Stylist',
      version: '2.5.0',
      profile,
      wardrobe,
      outfits,
      accounts: accounts.map(({ passwordHash, ...rest }) => ({
        ...rest,
        password: '[PROTECTED]'
      })),
    };

    const blob = new Blob([JSON.stringify(fullDb, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nika-database-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    setStatusMessage({ text: 'Database exported successfully as JSON file.', type: 'success' });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  // Reset to initial factory data
  const handleResetFactory = () => {
    if (window.confirm('Reset database to default luxury catalog? Custom added items will be refreshed.')) {
      localStorage.removeItem('nika_wardrobe_items');
      localStorage.removeItem('nika_saved_outfits');
      localStorage.removeItem('nika_user_profile');
      onDataChanged();
      setStatusMessage({ text: 'Database restored to default luxury showroom catalog.', type: 'success' });
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Copy SQL Schema
  const handleCopySchema = () => {
    navigator.clipboard.writeText(storageService.getPostgresSchemaSql());
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-5xl h-[85vh] max-h-[820px] rounded-3xl bg-noir-900 border border-gold-500/40 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-white/5 bg-noir-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-silk-100">
                  NIKA Database & Data Store
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Live & Persistent
                </span>
              </div>
              <p className="text-xs text-silk-400">
                Inspect collections, view raw records, export backups, and view PostgreSQL schemas.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-noir-850 hover:bg-gold-500/10 border border-white/10 hover:border-gold-500/30 text-xs font-mono text-gold-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-silk-400 hover:text-silk-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-2 border-b border-white/5 bg-noir-900/60 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
              activeTab === 'overview'
                ? 'bg-gold-500 text-noir-950 font-bold'
                : 'text-silk-400 hover:text-silk-200 hover:bg-white/5'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overview & Stats</span>
          </button>

          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
              activeTab === 'wardrobe'
                ? 'bg-gold-500 text-noir-950 font-bold'
                : 'text-silk-400 hover:text-silk-200 hover:bg-white/5'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            <span>Wardrobe Items ({wardrobe.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('outfits')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
              activeTab === 'outfits'
                ? 'bg-gold-500 text-noir-950 font-bold'
                : 'text-silk-400 hover:text-silk-200 hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Saved Outfits ({outfits.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
              activeTab === 'accounts'
                ? 'bg-gold-500 text-noir-950 font-bold'
                : 'text-silk-400 hover:text-silk-200 hover:bg-white/5'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Client Accounts ({accounts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
              activeTab === 'schema'
                ? 'bg-gold-500 text-noir-950 font-bold'
                : 'text-silk-400 hover:text-silk-200 hover:bg-white/5'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" />
            <span>SQL Schema (Postgres)</span>
          </button>
        </div>

        {/* Status message */}
        {statusMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-noir-850 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-silk-400">Collection: Wardrobe</span>
                    <Shirt className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-silk-100">{wardrobe.length}</div>
                  <p className="text-[11px] text-silk-500 mt-1">Digitized items across 7 categories</p>
                </div>

                <div className="p-4 rounded-2xl bg-noir-850 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-silk-400">Collection: Outfits</span>
                    <Sparkles className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-silk-100">{outfits.length}</div>
                  <p className="text-[11px] text-silk-500 mt-1">AI-styled editorial looks with color palettes</p>
                </div>

                <div className="p-4 rounded-2xl bg-noir-850 border border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase text-silk-400">Collection: Accounts</span>
                    <Users className="w-4 h-4 text-gold-400" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-silk-100">{accounts.length}</div>
                  <p className="text-[11px] text-silk-500 mt-1">Registered clients & VIP profiles</p>
                </div>
              </div>

              {/* Storage Architecture Details */}
              <div className="p-5 rounded-2xl bg-noir-850 border border-white/5 space-y-3">
                <h4 className="text-sm font-serif font-bold text-silk-100 flex items-center gap-2">
                  <Table className="w-4 h-4 text-gold-400" />
                  <span>Data Layer Architecture & Storage Engine</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-silk-300">
                  <div className="p-3.5 rounded-xl bg-noir-900 border border-white/5 space-y-2">
                    <div className="text-gold-300 font-bold uppercase text-[11px]">Primary Persistence Engine</div>
                    <p className="text-silk-400 leading-relaxed font-sans text-xs">
                      All records are saved immediately to browser-sandboxed local database keys:
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-[11px] text-silk-400">
                      <li><code>nika_wardrobe_items</code> (Items & metadata)</li>
                      <li><code>nika_saved_outfits</code> (Looks & color palettes)</li>
                      <li><code>nika_registered_accounts</code> (Authentication profiles)</li>
                      <li><code>nika_user_profile</code> (Style DNA & preferences)</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-noir-900 border border-white/5 space-y-2">
                    <div className="text-gold-300 font-bold uppercase text-[11px]">Cloud Integration Options</div>
                    <p className="text-silk-400 leading-relaxed font-sans text-xs">
                      Ready for production scale with:
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-[11px] text-silk-400">
                      <li><strong>Firebase Firestore</strong>: Provisioned via Google Cloud Console</li>
                      <li><strong>PostgreSQL</strong>: Relational schema ready for Cloud SQL or Supabase</li>
                      <li><strong>JSON Backup</strong>: Full snapshot export/import anytime</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Database Actions */}
              <div className="p-5 rounded-2xl bg-noir-850 border border-white/5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-mono font-bold text-silk-200">Database Operations</div>
                  <div className="text-[11px] text-silk-500">Backup your data or reset to showroom defaults</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportJson}
                    className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-noir-950 font-mono font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download JSON Backup</span>
                  </button>

                  <button
                    onClick={handleResetFactory}
                    className="px-3.5 py-2 rounded-xl bg-noir-900 hover:bg-rose-950/40 border border-white/10 hover:border-rose-500/30 text-rose-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset to Catalog</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: WARDROBE ITEMS TABLE */}
          {activeTab === 'wardrobe' && (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-xs font-mono text-silk-300">
                <thead className="bg-noir-950 text-silk-400 uppercase text-[10px] tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Brand</th>
                    <th className="py-3 px-4">Color</th>
                    <th className="py-3 px-4">Season</th>
                    <th className="py-3 px-4">Times Worn</th>
                    <th className="py-3 px-4">ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-noir-850">
                  {wardrobe.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-sans text-silk-100 flex items-center gap-2.5">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-cover border border-white/10 shrink-0"
                        />
                        <span className="font-medium truncate max-w-[180px]">{item.name}</span>
                      </td>
                      <td className="py-3 px-4 capitalize text-gold-300">{item.category}</td>
                      <td className="py-3 px-4">{item.brand}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-white/20"
                            style={{ backgroundColor: item.colorHex }}
                          />
                          <span>{item.color}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.season}</td>
                      <td className="py-3 px-4">{item.timesWorn}</td>
                      <td className="py-3 px-4 text-silk-500 text-[10px]">{item.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: SAVED OUTFITS TABLE */}
          {activeTab === 'outfits' && (
            <div className="space-y-4">
              {outfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="p-4 rounded-2xl bg-noir-850 border border-white/5 hover:border-gold-500/30 transition-colors space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-serif font-bold text-silk-100 text-base">{outfit.title}</h5>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/20">
                          {outfit.confidenceScore}% Match
                        </span>
                      </div>
                      <p className="text-xs text-silk-400 italic mt-0.5 font-serif">"{outfit.tagline}"</p>
                    </div>
                    <span className="text-[11px] font-mono text-silk-500">{outfit.id}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-silk-400">
                    <div><strong>Occasion:</strong> {outfit.occasion}</div>
                    <div><strong>Weather:</strong> {outfit.weather} ({outfit.temperature})</div>
                    <div><strong>Aesthetic:</strong> {outfit.styleAesthetic}</div>
                    <div><strong>Budget:</strong> {outfit.budgetTier}</div>
                  </div>

                  {/* Pieces preview */}
                  <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[11px] font-mono text-silk-300">
                    <span className="px-2 py-1 rounded bg-black/40 border border-white/5">
                      Top: {outfit.pieces.top?.name} ({outfit.pieces.top?.brand})
                    </span>
                    <span className="px-2 py-1 rounded bg-black/40 border border-white/5">
                      Bottom: {outfit.pieces.bottom?.name} ({outfit.pieces.bottom?.brand})
                    </span>
                    {outfit.pieces.outerwear && (
                      <span className="px-2 py-1 rounded bg-black/40 border border-white/5">
                        Outerwear: {outfit.pieces.outerwear?.name}
                      </span>
                    )}
                    {outfit.pieces.shoes && (
                      <span className="px-2 py-1 rounded bg-black/40 border border-white/5">
                        Shoes: {outfit.pieces.shoes?.name}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: CLIENT ACCOUNTS TABLE */}
          {activeTab === 'accounts' && (
            <div className="overflow-x-auto rounded-2xl border border-white/5">
              <table className="w-full text-left text-xs font-mono text-silk-300">
                <thead className="bg-noir-950 text-silk-400 uppercase text-[10px] tracking-wider border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Style DNA</th>
                    <th className="py-3 px-4">User UID</th>
                    <th className="py-3 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-noir-850">
                  {accounts.map((acc) => (
                    <tr key={acc.uid} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-sans text-silk-100 flex items-center gap-2.5">
                        <img
                          src={acc.photoURL}
                          alt={acc.name}
                          className="w-7 h-7 rounded-full object-cover border border-gold-500/30"
                        />
                        <span className="font-semibold">{acc.name}</span>
                      </td>
                      <td className="py-3 px-4 text-gold-300">{acc.email}</td>
                      <td className="py-3 px-4">{acc.styleDNA || 'Quiet Luxury'}</td>
                      <td className="py-3 px-4 text-silk-500 text-[10px]">{acc.uid}</td>
                      <td className="py-3 px-4 text-silk-400 text-[11px]">
                        {acc.createdAt ? new Date(acc.createdAt).toLocaleDateString() : 'Active VIP'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB: SQL SCHEMA */}
          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-serif font-bold text-silk-100 text-sm">PostgreSQL Production Schema</h5>
                  <p className="text-xs text-silk-400 font-mono">
                    DDL definitions for migrating to Cloud SQL, Supabase, or RDS.
                  </p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-noir-850 hover:bg-gold-500/10 border border-white/10 text-xs font-mono text-gold-300 transition-colors"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied!' : 'Copy SQL'}</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-noir-950 border border-white/10 font-mono text-xs text-emerald-400 overflow-x-auto leading-relaxed max-h-[460px]">
                <pre>{storageService.getPostgresSchemaSql()}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

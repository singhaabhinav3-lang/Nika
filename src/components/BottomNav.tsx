import React from 'react';
import { Home, Compass, Sparkles, Shirt, User } from 'lucide-react';
import { NavPage } from '../types';

interface BottomNavProps {
  currentPage: NavPage;
  onNavigate: (page: NavPage) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home' as NavPage, label: 'Home', icon: Home },
    { id: 'discover' as NavPage, label: 'Discover', icon: Compass },
    { id: 'create' as NavPage, label: 'Style Me', icon: Sparkles, isPrimary: true },
    { id: 'wardrobe' as NavPage, label: 'Wardrobe', icon: Shirt },
    { id: 'profile' as NavPage, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none pb-[env(safe-area-inset-bottom,16px)] px-4">
      <div className="max-w-md mx-auto pointer-events-auto">
        <nav className="flex items-center justify-around px-3 py-2 rounded-2xl glass-panel-gold bg-noir-900/90 shadow-2xl border border-white/10 mb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            if (item.isPrimary) {
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="relative group -mt-6 flex flex-col items-center justify-center"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gold-600 via-gold-500 to-gold-400 p-[1.5px] shadow-luxury-glow hover:scale-105 active:scale-95 transition-all">
                    <div className="w-full h-full rounded-full bg-noir-900 flex flex-col items-center justify-center text-gold-300 group-hover:bg-noir-850">
                      <Sparkles className="w-6 h-6 animate-pulse" />
                    </div>
                  </div>
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-gold-400 mt-1 uppercase">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all min-h-[44px] min-w-[48px] ${
                  isActive
                    ? 'text-gold-400'
                    : 'text-silk-400 hover:text-silk-200 hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold-400" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-1 tracking-tight transition-colors ${
                    isActive ? 'font-semibold text-gold-300' : 'text-silk-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

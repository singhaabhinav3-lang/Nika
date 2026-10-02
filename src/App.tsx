import React, { useState, useEffect } from 'react';
import { NavPage, UserProfile, Outfit, WardrobeItem, DiscoverLook } from './types';
import { storageService } from './services/storageService';
import { firebaseAuthService, AuthUser } from './services/firebase';
import { AuthGateScreen } from './components/AuthGateScreen';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { ShopLookModal } from './components/ShopLookModal';
import { VirtualTryOnModal } from './components/VirtualTryOnModal';
import { ShareOutfitModal } from './components/ShareOutfitModal';
import { AddWardrobeItemModal } from './components/AddWardrobeItemModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { AuthModal } from './components/AuthModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { DatabaseModal } from './components/DatabaseModal';

import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { CreateOutfitPage } from './pages/CreateOutfitPage';
import { OutfitResultPage } from './pages/OutfitResultPage';
import { WardrobePage } from './pages/WardrobePage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  // Authentication State Gate
  const [authUser, setAuthUser] = useState<AuthUser | null>(firebaseAuthService.getCurrentUser());
  const [authInitialized, setAuthInitialized] = useState(false);

  const [currentPage, setCurrentPage] = useState<NavPage>('home');
  const [profile, setProfile] = useState<UserProfile>(storageService.getProfile());
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(storageService.getWardrobe());
  const [savedOutfits, setSavedOutfits] = useState<Outfit[]>(storageService.getSavedOutfits());

  // Currently viewed outfit for OutfitResultPage
  const [activeOutfit, setActiveOutfit] = useState<Outfit>(savedOutfits[0]);
  const [prefilledOccasion, setPrefilledOccasion] = useState<string>('');

  // Modals state
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isTryOnModalOpen, setIsTryOnModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddWardrobeOpen, setIsAddWardrobeOpen] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);

  // Subscribe to Firebase Auth
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthState((user) => {
      setAuthUser(user);
      if (user) {
        // Sync profile with signed in user details
        setProfile((prev) => ({
          ...prev,
          name: user.displayName || prev.name,
          email: user.email || prev.email,
          avatarUrl: user.photoURL || prev.avatarUrl,
        }));
      }
      setAuthInitialized(true);
    });

    setProfile(storageService.getProfile());
    setWardrobe(storageService.getWardrobe());
    setSavedOutfits(storageService.getSavedOutfits());

    // Deep link support for #database or ?page=database
    const checkDeepLink = () => {
      try {
        const hash = window.location.hash.toLowerCase().replace('#', '');
        const params = new URLSearchParams(window.location.search);
        const target = params.get('page') || params.get('tab') || hash;

        if (target === 'database' || target === 'db') {
          if (!firebaseAuthService.getCurrentUser()) {
            firebaseAuthService.signInDemoClient();
            setAuthUser(firebaseAuthService.getCurrentUser());
          }
          setIsDatabaseModalOpen(true);
        }
      } catch (e) {
        // Ignore
      }
    };

    checkDeepLink();
    window.addEventListener('hashchange', checkDeepLink);

    return () => {
      window.removeEventListener('hashchange', checkDeepLink);
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const handleSignedIn = (user: AuthUser) => {
    setAuthUser(user);
    if (user.displayName || user.email) {
      const updatedProfile: UserProfile = {
        ...profile,
        name: user.displayName || profile.name,
        email: user.email || profile.email,
        avatarUrl: user.photoURL || profile.avatarUrl,
      };
      setProfile(updatedProfile);
      storageService.saveProfile(updatedProfile);
    }
  };

  const handleSignOut = async () => {
    await firebaseAuthService.signOut();
    setAuthUser(null);
    setCurrentPage('home');
  };

  const handleNavigate = (page: NavPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOccasion = (occ: string) => {
    setPrefilledOccasion(occ);
    handleNavigate('create');
  };

  const handleOutfitGenerated = (outfit: Outfit) => {
    setActiveOutfit(outfit);
    storageService.saveNewOutfit(outfit);
    setSavedOutfits(storageService.getSavedOutfits());
    handleNavigate('outfit-result');
  };

  const handleOpenOutfit = (outfit: Outfit) => {
    setActiveOutfit(outfit);
    handleNavigate('outfit-result');
  };

  const handleToggleFavorite = (id: string) => {
    const updated = storageService.toggleFavoriteOutfit(id);
    setSavedOutfits(updated);
    if (activeOutfit && activeOutfit.id === id) {
      setActiveOutfit({ ...activeOutfit, isFavorite: !activeOutfit.isFavorite });
    }
  };

  const handleSaveOutfit = (outfit: Outfit) => {
    handleToggleFavorite(outfit.id);
  };

  const handleDeleteOutfit = (id: string) => {
    storageService.deleteSavedOutfit(id);
    setSavedOutfits(storageService.getSavedOutfits());
  };

  const handleAddItemToWardrobe = (item: Omit<WardrobeItem, 'id' | 'addedAt' | 'timesWorn'>) => {
    storageService.addWardrobeItem(item);
    setWardrobe(storageService.getWardrobe());
    setProfile(storageService.getProfile());
  };

  const handleDeleteWardrobeItem = (id: string) => {
    storageService.deleteWardrobeItem(id);
    setWardrobe(storageService.getWardrobe());
    setProfile(storageService.getProfile());
  };

  const handleUpgradeVip = (tier: 'NIKA Atelier VIP' | 'NIKA Haute Privé') => {
    const updated: UserProfile = {
      ...profile,
      isVipMember: true,
      vipTier: tier,
    };
    storageService.saveProfile(updated);
    setProfile(updated);
  };

  const handleSaveProfile = (updated: UserProfile) => {
    storageService.saveProfile(updated);
    setProfile(updated);
  };

  const handleStyleLikeDiscoverLook = (look: DiscoverLook) => {
    setActiveOutfit(look.fullOutfit);
    handleNavigate('outfit-result');
  };

  // STRICT AUTHENTICATION GATE:
  // If the user is NOT authenticated, do not allow access to any functionality!
  if (!authUser) {
    return <AuthGateScreen onSignedIn={handleSignedIn} />;
  }

  // Once authenticated, unlock full application functionality
  return (
    <div className="min-h-screen bg-noir-950 text-silk-100 flex flex-col font-sans selection:bg-gold-500/30 selection:text-gold-200">
      {/* Top Luxury Navbar */}
      <Navbar
        profile={profile}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenVipModal={() => setIsVipModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 pt-6 sm:pt-8">
        {currentPage === 'home' && (
          <HomePage
            profile={profile}
            savedOutfits={savedOutfits}
            wardrobe={wardrobe}
            onNavigate={handleNavigate}
            onSelectOccasion={handleSelectOccasion}
            onOpenOutfit={handleOpenOutfit}
            onOpenVipModal={() => setIsVipModalOpen(true)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentPage === 'discover' && (
          <DiscoverPage
            onStyleLikeThis={handleStyleLikeDiscoverLook}
            onOpenOutfit={handleOpenOutfit}
          />
        )}

        {currentPage === 'create' && (
          <CreateOutfitPage
            profile={profile}
            wardrobe={wardrobe}
            prefilledOccasion={prefilledOccasion}
            onOutfitGenerated={handleOutfitGenerated}
          />
        )}

        {currentPage === 'outfit-result' && (
          <OutfitResultPage
            outfit={activeOutfit}
            onNavigate={handleNavigate}
            onSaveOutfit={handleSaveOutfit}
            onOpenShopModal={() => setIsShopModalOpen(true)}
            onOpenTryOnModal={() => setIsTryOnModalOpen(true)}
            onOpenShareModal={() => setIsShareModalOpen(true)}
          />
        )}

        {currentPage === 'wardrobe' && (
          <WardrobePage
            wardrobe={wardrobe}
            onOpenAddItemModal={() => setIsAddWardrobeOpen(true)}
            onDeleteItem={handleDeleteWardrobeItem}
            onNavigate={handleNavigate}
            onGenerateClosetOutfit={() => {
              setPrefilledOccasion('Look from my clothes only');
              handleNavigate('create');
            }}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            profile={profile}
            savedOutfits={savedOutfits}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenVipModal={() => setIsVipModalOpen(true)}
            onOpenOutfit={handleOpenOutfit}
            onDeleteOutfit={handleDeleteOutfit}
            onSignOut={handleSignOut}
            onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          />
        )}
      </main>

      {/* Luxury Floating Mobile-First Bottom Navigation */}
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />

      {/* Interactive Modals */}
      <ShopLookModal
        outfit={activeOutfit}
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
      />

      <VirtualTryOnModal
        outfit={activeOutfit}
        isOpen={isTryOnModalOpen}
        onClose={() => setIsTryOnModalOpen(false)}
      />

      <ShareOutfitModal
        outfit={activeOutfit}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AddWardrobeItemModal
        isOpen={isAddWardrobeOpen}
        onClose={() => setIsAddWardrobeOpen(false)}
        onAddItem={handleAddItemToWardrobe}
      />

      <SubscriptionModal
        profile={profile}
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onUpgrade={handleUpgradeVip}
      />

      <AuthModal
        profile={profile}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      <DatabaseModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
        onDataChanged={() => {
          setWardrobe(storageService.getWardrobe());
          setSavedOutfits(storageService.getSavedOutfits());
          setProfile(storageService.getProfile());
        }}
      />
    </div>
  );
}

export default App;

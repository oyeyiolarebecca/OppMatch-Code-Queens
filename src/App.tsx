import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SEED_OPPORTUNITIES, SEED_COMMUNITIES } from './data/seedData';
import { Opportunity, Community } from './types';
import { Sidebar, NavView } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { LandingView } from './views/LandingView';
import { AuthModal } from './views/AuthModal';
import { DashboardView } from './views/DashboardView';
import { OpportunitiesDirectoryView } from './views/OpportunitiesDirectoryView';
import { CommunitiesDirectoryView } from './views/CommunitiesDirectoryView';
import { OpportunityDetailView } from './views/OpportunityDetailView';
import { CVReviewView } from './views/CVReviewView';
import { LinkedInReviewView } from './views/LinkedInReviewView';
import { ProfileView } from './views/ProfileView';
import { TrackedApplicationsView } from './views/TrackedApplicationsView';
import { SplashScreen } from './components/SplashScreen';
import { X } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, user, isDemoMode, loadDemoUser, trackedApplications } = useAuth();

  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // Unified opportunities state (seed + live sourced)
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    try {
      const cached = localStorage.getItem('oppmatch_all_opportunities');
      if (cached) {
        const parsed: Opportunity[] = JSON.parse(cached);
        const map = new Map<string, Opportunity>();
        SEED_OPPORTUNITIES.forEach((o) => map.set(o.id, o));
        parsed.forEach((o) => map.set(o.id, o));
        return Array.from(map.values());
      }
    } catch {}
    return SEED_OPPORTUNITIES;
  });

  const handleAddLiveOpportunities = (newOpps: Opportunity[]) => {
    setOpportunities((prev) => {
      const map = new Map<string, Opportunity>();
      prev.forEach((o) => map.set(o.id, o));
      newOpps.forEach((o) => map.set(o.id, o));
      const merged = Array.from(map.values());
      try {
        localStorage.setItem('oppmatch_all_opportunities', JSON.stringify(merged));
      } catch {}
      return merged;
    });
  };

  const savedCount = Object.keys(trackedApplications).length;

  // Handle navigation
  const handleNavigate = (view: NavView) => {
    setSelectedOpportunity(null);
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOpportunity = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTryDemo = () => {
    loadDemoUser();
    setSelectedOpportunity(null);
    setCurrentView('dashboard');
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (isNewUser: boolean) => {
    if (isNewUser) {
      setCurrentView('profile');
    } else {
      setCurrentView('dashboard');
    }
  };

  // Splash screen presentation
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} durationMs={1600} />;
  }

  // If user is not authenticated and has not clicked Try Demo, show the landing page
  if (!isAuthenticated || !user) {
    return (
      <>
        <LandingView
          onTryDemo={handleTryDemo}
          onOpenAuth={handleOpenAuth}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // Authenticated Application Shell (Sidebar + Navbar + View Layout from image.png)
  return (
    <div className="min-h-screen bg-[#F8F3EA] text-[#332C28] flex">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          savedCount={savedCount}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-[#332C28]/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-72 bg-[#FFFDF8] border-r border-[#E4DCD3] h-full flex flex-col">
            <div className="absolute top-4 right-4 z-20">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-[#756B64] hover:text-[#332C28]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar
              currentView={currentView}
              onNavigate={handleNavigate}
              savedCount={savedCount}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
          onNavigate={handleNavigate}
          savedCount={savedCount}
          onSearchClick={() => handleNavigate('opportunities')}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* If an Opportunity is currently selected, display the two-column Opportunity Detail View */}
          {selectedOpportunity ? (
            <OpportunityDetailView
              opportunity={selectedOpportunity}
              profile={user}
              onBack={() => setSelectedOpportunity(null)}
              onOpenCVReview={() => {
                setSelectedOpportunity(null);
                setCurrentView('cv-review');
              }}
            />
          ) : (
            <>
              {currentView === 'dashboard' && (
                <DashboardView
                  profile={user}
                  opportunities={opportunities}
                  communities={SEED_COMMUNITIES}
                  onSelectOpportunity={handleSelectOpportunity}
                  onExploreCommunity={(comm) => {
                    handleNavigate('communities');
                  }}
                  onNavigate={handleNavigate}
                />
              )}

              {currentView === 'opportunities' && (
                <OpportunitiesDirectoryView
                  opportunities={opportunities}
                  communities={SEED_COMMUNITIES}
                  profile={user}
                  onSelectOpportunity={handleSelectOpportunity}
                  onAddLiveOpportunities={handleAddLiveOpportunities}
                />
              )}

              {currentView === 'communities' && (
                <CommunitiesDirectoryView
                  communities={SEED_COMMUNITIES}
                  opportunities={opportunities}
                  profile={user}
                  onSelectOpportunity={handleSelectOpportunity}
                />
              )}

              {currentView === 'cv-review' && (
                <CVReviewView
                  profile={user}
                  matchedOpportunities={opportunities}
                  onSelectOpportunity={handleSelectOpportunity}
                />
              )}

              {currentView === 'linkedin-review' && (
                <LinkedInReviewView profile={user} />
              )}

              {currentView === 'profile' && (
                <ProfileView profile={user} />
              )}

              {currentView === 'tracked' && (
                <TrackedApplicationsView
                  opportunities={opportunities}
                  profile={user}
                  onSelectOpportunity={handleSelectOpportunity}
                  onBrowseMore={() => handleNavigate('opportunities')}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Auth Modal if triggered in app */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
}

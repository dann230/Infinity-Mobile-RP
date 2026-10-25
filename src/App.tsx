import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ComplaintPanel } from './components/ComplaintPanel';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FactionActionModal } from './components/FactionActionModal';
import { Footer } from './components/Footer';
import { FACTIONS_DATA } from './data/factionsData';
import { AdminUser, Faction } from './types/roleplay';

export default function App() {
  const [activeTab, setActiveTab] = useState<'factions' | 'complaints' | 'admin'>('factions');
  const [factionsList, setFactionsList] = useState<Faction[]>(() => {
    const saved = localStorage.getItem('infinity_factions_data_v4');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return FACTIONS_DATA;
      }
    }
    return FACTIONS_DATA;
  });

  // Save changes to localStorage so modifications by State/OCG curators persist
  useEffect(() => {
    localStorage.setItem('infinity_factions_data_v4', JSON.stringify(factionsList));
  }, [factionsList]);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('infinity_admin_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Faction Action Modal state (from home page cards: commands, ranks, roster)
  const [modalFaction, setModalFaction] = useState<Faction | null>(null);
  const [modalAction, setModalAction] = useState<'commands' | 'ranks' | 'roster'>('commands');
  const [isFactionModalOpen, setIsFactionModalOpen] = useState(false);

  const handleAdminLogin = (user: AdminUser) => {
    setAdminUser(user);
    localStorage.setItem('infinity_admin_session', JSON.stringify(user));
  };

  const handleAdminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem('infinity_admin_session');
  };

  const handleOpenFactionActionModal = (
    faction: Faction, 
    action: 'commands' | 'ranks' | 'roster'
  ) => {
    setModalFaction(faction);
    setModalAction(action);
    setIsFactionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        adminUser={adminUser}
        onOpenAdminLogin={() => setIsAdminModalOpen(true)}
        onAdminLogout={handleAdminLogout}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE (Hero Section with All Factions Listed & Options Selector) */}
        {activeTab === 'factions' && (
          <HeroSection
            factionsList={factionsList}
            onSelectFactionAction={handleOpenFactionActionModal}
            onOpenComplaints={() => setActiveTab('complaints')}
          />
        )}

        {/* VIEW 3: PLAYER COMPLAINT PANEL */}
        {activeTab === 'complaints' && (
          <ComplaintPanel adminUser={adminUser} />
        )}

        {/* VIEW 4: ADMINISTRATION DASHBOARD (STATE & OCG CURATORS) */}
        {activeTab === 'admin' && (
          <AdminDashboard
            adminUser={adminUser}
            factionsList={factionsList}
            setFactionsList={setFactionsList}
            onOpenLogin={() => setIsAdminModalOpen(true)}
            onLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActiveTab} />

      {/* Interactive Faction Action Modal (triggered when clicking factions on Home Page) */}
      <FactionActionModal
        faction={modalFaction}
        isOpen={isFactionModalOpen}
        onClose={() => setIsFactionModalOpen(false)}
        defaultAction={modalAction}
      />

      {/* Secured Admin Authentication Modal (State / OCG distinction) */}
      <AdminLoginModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLogin={handleAdminLogin}
      />
    </div>
  );
}

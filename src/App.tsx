import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DressCodeViewer } from './components/DressCodeViewer';
import { ComplaintPanel } from './components/ComplaintPanel';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { FactionActionModal } from './components/FactionActionModal';
import { Footer } from './components/Footer';
import { FACTIONS_DATA } from './data/factionsData';
import { AdminUser, Faction } from './types/roleplay';

export default function App() {
  const [activeTab, setActiveTab] = useState<'factions' | 'dresscode' | 'complaints' | 'admin'>('factions');
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

  const [selectedDressCodeFactionId, setSelectedDressCodeFactionId] = useState<string>(factionsList[0].id);
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

  // Faction Action Modal state (from home page cards)
  const [modalFaction, setModalFaction] = useState<Faction | null>(null);
  const [modalAction, setModalAction] = useState<'commands' | 'dresscode' | 'ranks' | 'roster'>('commands');
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
    action: 'commands' | 'dresscode' | 'ranks' | 'roster'
  ) => {
    setModalFaction(faction);
    setModalAction(action);
    setIsFactionModalOpen(true);
  };

  const selectedDressCodeFaction = factionsList.find((f) => f.id === selectedDressCodeFactionId) || factionsList[0];

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

        {/* VIEW 2: DEDICATED STAFF DRESS CODE DIRECTORY */}
        {activeTab === 'dresscode' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Official Staff Dress Code Directory
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-0.5">
                    Select any State or OCG faction to inspect male and female staff uniforms, rank skins, required gear, and regulations.
                  </p>
                </div>
              </div>

              {/* Faction selector pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-800">
                {factionsList.map((faction) => {
                  const isSelected = faction.id === selectedDressCodeFactionId;
                  return (
                    <button
                      key={faction.id}
                      onClick={() => setSelectedDressCodeFactionId(faction.id)}
                      className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 border ${
                        isSelected
                          ? 'bg-neutral-800 text-white border-neutral-600 shadow-md'
                          : 'bg-neutral-900/60 text-neutral-400 hover:text-neutral-200 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      <div 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: faction.accentColor }} 
                      />
                      <span>{faction.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8">
              <DressCodeViewer faction={selectedDressCodeFaction} />
            </div>
          </div>
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

import React, { useState } from 'react';
import { Faction } from '../types/roleplay';
import { FACTIONS_DATA } from '../data/factionsData';
import { 
  Terminal, 
  Shirt, 
  Award, 
  Users, 
  ArrowRight, 
  Shield, 
  Skull, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import heroBanner from '../assets/images/infinity_hero_banner_1791582889853.jpg';

interface HeroSectionProps {
  factionsList?: Faction[];
  onSelectFactionAction: (faction: Faction, action: 'commands' | 'dresscode' | 'ranks' | 'roster') => void;
  onOpenComplaints: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  factionsList = FACTIONS_DATA,
  onSelectFactionAction,
  onOpenComplaints
}) => {
  const [sectorFilter, setSectorFilter] = useState<'all' | 'state' | 'ocg'>('all');

  const stateFactions = factionsList.filter((f) => f.sector === 'state');
  const ocgFactions = factionsList.filter((f) => f.sector === 'ocg');

  const displayedFactions = sectorFilter === 'all' 
    ? factionsList 
    : sectorFilter === 'state' 
    ? stateFactions 
    : ocgFactions;

  return (
    <section className="relative bg-neutral-950 border-b border-neutral-800 overflow-hidden">
      {/* Background Graphic with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBanner}
          alt="Infinity Mobile Roleplay City Backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-20 filter brightness-75 contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 space-y-10">
        {/* Top Hero Pitch */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
            <span className="text-cyan-400 tracking-wide uppercase">Infinity Mobile Roleplay</span>
            <span aria-hidden="true">·</span>
            <span>Official Portal</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400">Under Active Development</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Explore Factions, Commands, Dress Codes & Administration
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
            All official factions operate with a standardized <strong>1–10 Rank Hierarchy</strong> (Rank 10 Leader, Rank 9 Deputy with strictly 3 DEPs). Select any faction below to view slash commands, staff dress codes, or department rosters.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onOpenComplaints}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs sm:text-sm rounded-lg transition-colors shadow-sm shadow-amber-400/20"
            >
              File Player Complaint
            </button>
            <span className="text-xs text-neutral-400 font-mono">
              {factionsList.length} Total Factions ({stateFactions.length} State · {ocgFactions.length} OCG)
            </span>
          </div>
        </div>

        {/* Faction Listings & Action Selector Section */}
        <div className="space-y-6 pt-4 border-t border-neutral-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                All Infinity Mobile Factions
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Click any faction card to open the interactive options menu (Commands, Dress Code, Ranks, Roster).
              </p>
            </div>

            {/* Filter segmented buttons */}
            <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg self-start sm:self-auto">
              <button
                onClick={() => setSectorFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  sectorFilter === 'all' ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All ({factionsList.length})
              </button>
              <button
                onClick={() => setSectorFilter('state')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  sectorFilter === 'state' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>State ({stateFactions.length})</span>
              </button>
              <button
                onClick={() => setSectorFilter('ocg')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  sectorFilter === 'ocg' ? 'bg-rose-950 text-rose-300 border border-rose-800/60 shadow-sm' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Skull className="w-3.5 h-3.5 text-rose-400" />
                <span>OCG ({ocgFactions.length})</span>
              </button>
            </div>
          </div>

          {/* Factions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedFactions.map((faction) => {
              const isState = faction.sector === 'state';

              return (
                <div
                  key={faction.id}
                  className="bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded-2xl p-5 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0">
                          <img
                            src={faction.badgeImage}
                            alt={faction.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                            <span style={{ color: faction.accentColor }}>
                              {isState ? 'State Organization' : 'OCG Syndicate'}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-neutral-400">10 Ranks</span>
                          </div>
                          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {faction.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {faction.tagline}
                    </p>

                    {/* Leader and Deputy Summary */}
                    <div className="p-2.5 bg-neutral-950/70 border border-neutral-800/80 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Leader (Rank 10):</span>
                        <span className="font-mono text-white font-medium truncate max-w-[170px]">
                          {faction.currentLeader}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-neutral-500">Deputies (Rank 9):</span>
                        <span className="font-mono text-cyan-300 font-semibold">
                          3 DEPs Maximum
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Options Menu buttons */}
                  <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 block">
                      Select What To View:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => onSelectFactionAction(faction, 'commands')}
                        className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 hover:text-cyan-300 border border-neutral-800 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Commands</span>
                      </button>

                      <button
                        onClick={() => onSelectFactionAction(faction, 'dresscode')}
                        className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 hover:text-cyan-300 border border-neutral-800 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Shirt className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Dress Code</span>
                      </button>

                      <button
                        onClick={() => onSelectFactionAction(faction, 'ranks')}
                        className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 hover:text-cyan-300 border border-neutral-800 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Award className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Ranks (1-10)</span>
                      </button>

                      <button
                        onClick={() => onSelectFactionAction(faction, 'roster')}
                        className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-200 hover:text-cyan-300 border border-neutral-800 rounded-lg text-xs font-medium transition-colors"
                      >
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Roster</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

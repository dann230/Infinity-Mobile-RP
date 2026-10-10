import React, { useState, useEffect } from 'react';
import { FACTIONS_DATA } from '../data/factionsData';
import { Faction, CommandItem } from '../types/roleplay';
import { DressCodeViewer } from './DressCodeViewer';
import { 
  Search, 
  Copy, 
  Check, 
  Terminal, 
  Shirt, 
  Users, 
  Award,
  Shield, 
  Info,
  Clock,
  Briefcase
} from 'lucide-react';

interface FactionExplorerProps {
  initialFactionId?: string;
  initialSubTab?: 'commands' | 'dresscode' | 'ranks' | 'roster';
}

export const FactionExplorer: React.FC<FactionExplorerProps> = ({ 
  initialFactionId,
  initialSubTab = 'commands'
}) => {
  const [selectedFactionId, setSelectedFactionId] = useState<string>(
    initialFactionId || FACTIONS_DATA[0].id
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'commands' | 'dresscode' | 'ranks' | 'roster'>(initialSubTab);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (initialFactionId) {
      setSelectedFactionId(initialFactionId);
    }
  }, [initialFactionId]);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const selectedFaction = FACTIONS_DATA.find((f) => f.id === selectedFactionId) || FACTIONS_DATA[0];

  const handleCopy = (cmd: string) => {
    const textToCopy = cmd.split(' ')[0] || cmd;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCommand(cmd);
    setTimeout(() => {
      setCopiedCommand(null);
    }, 2000);
  };

  const filteredCommands = selectedFaction.commands.filter((cmd) => {
    const matchesSearch = 
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cmd.syntax && cmd.syntax.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || cmd.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Sector / Faction Selection Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Faction Manual & Command Database
          </h2>
          <span className="text-xs text-neutral-400 hidden sm:inline">
            Select a department to view commands, 1–10 ranks, and staff dress codes
          </span>
        </div>

        {/* Horizontal scrollable faction tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-800">
          {FACTIONS_DATA.map((faction) => {
            const isSelected = faction.id === selectedFactionId;
            return (
              <button
                key={faction.id}
                onClick={() => {
                  setSelectedFactionId(faction.id);
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 border ${
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

      {/* Selected Faction Info Card */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden shrink-0 shadow-lg">
              <img
                src={selectedFaction.badgeImage}
                alt={`${selectedFaction.name} badge`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                <span style={{ color: selectedFaction.accentColor }}>
                  {selectedFaction.sector === 'state' ? 'State Organization' : 'Underground Crime Syndicate'}
                </span>
                <span aria-hidden="true">·</span>
                <span>Standard Ranks 1–10</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {selectedFaction.name}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl">
                {selectedFaction.tagline}
              </p>
            </div>
          </div>

          {/* Quick Faction Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-neutral-950/80 p-4 rounded-xl border border-neutral-800 shrink-0">
            <div>
              <span className="text-neutral-500 block">Current Leader (Rank 10)</span>
              <span className="font-medium text-white font-mono">{selectedFaction.currentLeader}</span>
            </div>
            <div>
              <span className="text-neutral-500 block">Deputies (Rank 9)</span>
              <span className="font-mono text-cyan-300 font-medium">3 DEPs Only</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-neutral-500 block">Active Personnel</span>
              <span className="font-mono tabular-nums text-emerald-400 font-semibold">
                {selectedFaction.stats.onDutyNow} On Duty / {selectedFaction.stats.activeMembers} Total
              </span>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pt-2 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('commands')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'commands'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Commands Manual ({selectedFaction.commands.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('dresscode')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'dresscode'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Dress Code (Male & Female)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('ranks')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'ranks'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Ranks 1–10 & Deputies</span>
          </button>

          <button
            onClick={() => setActiveSubTab('roster')}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeSubTab === 'roster'
                ? 'border-cyan-400 text-cyan-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Personnel & Rankings</span>
          </button>
        </div>

        {/* Sub-tab Content: COMMANDS */}
        {activeSubTab === 'commands' && (
          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  placeholder={`Search ${selectedFaction.shortName} commands...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="flex items-center gap-1 overflow-x-auto p-1 bg-neutral-950 border border-neutral-800 rounded-lg scrollbar-none">
                {['all', 'core', 'tactical', 'duty', 'economy', 'broadcast', 'administration'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap ${
                      categoryFilter === cat
                        ? 'bg-neutral-800 text-white'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {copiedCommand && (
              <div className="p-3 bg-cyan-950/80 border border-cyan-800/80 rounded-lg text-xs text-cyan-300 flex items-center justify-between">
                <span>Command <strong>{copiedCommand}</strong> copied to clipboard! Ready to paste in-game console.</span>
                <Check className="w-4 h-4 text-cyan-400" />
              </div>
            )}

            {filteredCommands.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredCommands.map((item) => (
                  <div
                    key={item.id}
                    className="bg-neutral-950/70 border border-neutral-800 hover:border-neutral-700 rounded-xl p-4 sm:p-5 transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-sm sm:text-base font-bold font-mono text-cyan-300 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-900/60">
                          {item.command}
                        </code>

                        <button
                          onClick={() => handleCopy(item.command)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors focus:outline-none"
                          title="Copy command"
                        >
                          {copiedCommand === item.command ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-800/80 space-y-1.5 text-xs">
                      {item.syntax && (
                        <div className="flex items-start gap-1.5 text-neutral-400">
                          <span className="font-semibold text-neutral-500 shrink-0 font-mono">Syntax:</span>
                          <span className="font-mono text-neutral-300 break-all">{item.syntax}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-neutral-500 pt-1">
                        {item.minRank && (
                          <span>Requires: <strong className="text-neutral-400 font-medium">{item.minRank}</strong></span>
                        )}
                        <span className="capitalize font-mono text-[11px] bg-neutral-900 px-2 py-0.5 rounded text-neutral-400 border border-neutral-800">
                          {item.category}
                        </span>
                      </div>

                      {item.tip && (
                        <div className="text-[11px] text-amber-400/90 pt-1 flex items-start gap-1">
                          <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{item.tip}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border border-dashed border-neutral-800 rounded-xl space-y-2">
                <Terminal className="w-8 h-8 mx-auto text-neutral-600" />
                <h4 className="text-sm font-semibold text-neutral-300">No commands found</h4>
                <p className="text-xs text-neutral-500">
                  Try adjusting your search query or reset the category filter.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sub-tab Content: DRESS CODE */}
        {activeSubTab === 'dresscode' && (
          <div className="pt-2">
            <DressCodeViewer faction={selectedFaction} />
          </div>
        )}

        {/* Sub-tab Content: RANKS 1–10 */}
        {activeSubTab === 'ranks' && (
          <div className="space-y-4 pt-2">
            <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1">
              <span className="text-xs font-bold text-cyan-400 block uppercase tracking-wider">
                Rank 10 Leader · Rank 9 Deputy (Strictly 3 DEPs Only)
              </span>
              <p className="text-xs text-neutral-300">
                All factions follow a uniform 10-rank hierarchy to ensure balanced authority and promotion pathways.
              </p>
            </div>

            <div className="space-y-2">
              {selectedFaction.ranks.slice().reverse().map((rank) => (
                <div
                  key={rank.level}
                  className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    rank.isLeader
                      ? 'bg-amber-950/20 border-amber-800/80'
                      : rank.isDeputy
                      ? 'bg-cyan-950/20 border-cyan-800/80'
                      : 'bg-neutral-950/60 border-neutral-800/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg font-mono font-bold text-xs flex items-center justify-center shrink-0 border ${
                      rank.isLeader
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : rank.isDeputy
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                    }`}>
                      {rank.level}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{rank.title}</h4>
                        {rank.isLeader && (
                          <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 rounded font-semibold">
                            Leader (Max 1)
                          </span>
                        )}
                        {rank.isDeputy && (
                          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 rounded font-semibold">
                            Deputy (3 DEPs Only)
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">{rank.responsibilities}</p>
                    </div>
                  </div>

                  <div className="shrink-0 text-xs sm:text-right">
                    {rank.isLeader && (
                      <span className="text-amber-300 font-mono font-medium">
                        Current: {selectedFaction.currentLeader}
                      </span>
                    )}
                    {rank.isDeputy && (
                      <span className="text-cyan-300 font-mono font-medium">
                        Active: {selectedFaction.deputies.join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-tab Content: ROSTER */}
        {activeSubTab === 'roster' && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-bold text-white">Department Personnel & Ranking Ledger</h4>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Top performing staff members, verified weekly shift hours, and completed duty quotas.
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                Grade: <strong className="text-emerald-400">{selectedFaction.stats.weeklyPerformanceGrade}</strong>
              </span>
            </div>

            <div className="overflow-x-auto border border-neutral-800 rounded-xl">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-neutral-950 text-neutral-400 uppercase text-[11px] font-semibold border-b border-neutral-800 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Rank Title</th>
                    <th className="py-3 px-4 text-right">Weekly Shift Hours</th>
                    <th className="py-3 px-4 text-right">Tasks / Quotas</th>
                    <th className="py-3 px-4 text-center">Duty Status</th>
                    <th className="py-3 px-4 text-right">Commendations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-200">
                  {selectedFaction.members.map((member) => (
                    <tr key={member.id} className="hover:bg-neutral-950/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-white flex items-center gap-2">
                        <span>{member.name}</span>
                        {member.isDeputySlot && (
                          <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 rounded font-sans">
                            DEP
                          </span>
                        )}
                        {member.rankLevel === 10 && (
                          <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 rounded font-sans">
                            LEADER
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-300">{member.rankTitle}</td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-neutral-300">
                        {member.dutyHoursThisWeek} hrs
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-cyan-400 font-medium">
                        {member.completedTasks}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          member.status === 'on_duty'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}>
                          {member.status === 'on_duty' ? 'On Duty' : 'Off Duty'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-400">
                        +{member.commendations}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

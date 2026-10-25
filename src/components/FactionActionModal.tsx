import React, { useState } from 'react';
import { Faction, FactionRankTier } from '../types/roleplay';
import { 
  X, 
  Terminal, 
  Award, 
  Users, 
  Copy, 
  Check, 
  Search, 
  Info, 
  Crown, 
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface FactionActionModalProps {
  faction: Faction | null;
  isOpen: boolean;
  onClose: () => void;
  defaultAction?: 'commands' | 'ranks' | 'roster';
}

export const FactionActionModal: React.FC<FactionActionModalProps> = ({
  faction,
  isOpen,
  onClose,
  defaultAction = 'commands'
}) => {
  const [activeTab, setActiveTab] = useState<'commands' | 'ranks' | 'roster'>(defaultAction);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen || !faction) return null;

  const handleCopy = (cmd: string) => {
    const textToCopy = cmd.split(' ')[0] || cmd;
    navigator.clipboard.writeText(textToCopy);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const filteredCommands = faction.commands.filter((c) =>
    c.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.syntax && c.syntax.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 bg-neutral-950/90 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden shrink-0 shadow-md">
              <img
                src={faction.badgeImage}
                alt={faction.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                <span style={{ color: faction.accentColor }}>{faction.sector === 'state' ? 'State Organization' : 'Underground Crime Syndicate'}</span>
                <span aria-hidden="true">·</span>
                <span>Ranks 1–10 Standard</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {faction.name}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-400 mt-1">
                <span>Rank Hierarchy: <strong className="text-white font-mono">10 Standard Tiers</strong></span>
                <span aria-hidden="true">·</span>
                <span>Deputies (Rank 9): <strong className="text-cyan-300 font-mono">3 DEPs Maximum</strong></span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="Close window"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Selection Bar (Commands, Ranks, Roster) */}
        <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2.5 bg-neutral-950 border-b border-neutral-800 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('commands')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'commands'
                ? 'bg-neutral-800 text-cyan-300 border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Commands ({faction.commands.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ranks')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ranks'
                ? 'bg-neutral-800 text-cyan-300 border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Award className="w-4 h-4 text-cyan-400" />
            <span>Ranks 1–10 Structure</span>
          </button>

          <button
            onClick={() => setActiveTab('roster')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'roster'
                ? 'bg-neutral-800 text-cyan-300 border border-neutral-700 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Department Roster</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: COMMANDS */}
          {activeTab === 'commands' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    placeholder={`Search ${faction.shortName} commands...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <span className="text-xs text-neutral-500 font-mono">
                  Showing {filteredCommands.length} of {faction.commands.length} commands
                </span>
              </div>

              {copiedCmd && (
                <div className="p-2.5 bg-cyan-950/80 border border-cyan-800 rounded-lg text-xs text-cyan-300 flex items-center justify-between">
                  <span>Command <strong>{copiedCmd}</strong> copied to clipboard!</span>
                  <Check className="w-4 h-4 text-cyan-400" />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredCommands.map((cmd) => (
                  <div
                    key={cmd.id}
                    className="bg-neutral-950/80 border border-neutral-800/90 rounded-xl p-4 flex flex-col justify-between space-y-2.5 hover:border-neutral-700 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-sm font-bold font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-900/60">
                          {cmd.command}
                        </code>
                        <button
                          onClick={() => handleCopy(cmd.command)}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md transition-colors"
                          title="Copy command"
                        >
                          {copiedCmd === cmd.command ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {cmd.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-900 text-[11px] text-neutral-400 space-y-1">
                      {cmd.syntax && (
                        <div className="font-mono text-neutral-400 truncate">
                          Syntax: <span className="text-neutral-300">{cmd.syntax}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-0.5">
                        {cmd.minRank && <span>Required: <strong className="text-neutral-300 font-medium">{cmd.minRank}</strong></span>}
                        <span className="capitalize font-mono text-[10px] bg-neutral-900 px-2 py-0.5 rounded text-neutral-400">
                          {cmd.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: RANKS 1-10 & DEPUTIES */}
          {activeTab === 'ranks' && (
            <div className="space-y-6">
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Award className="w-4 h-4" />
                  <span>Standard 1–10 Hierarchy Structure</span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Every faction in Infinity Mobile operates on a strictly calibrated 10-rank hierarchy. 
                  <strong className="text-white"> Rank 10 is the singular Supreme Leader position</strong>, and 
                  <strong className="text-cyan-300"> Rank 9 is Deputy Leader with a hard quota of exactly 3 DEPs maximum</strong>.
                </p>
              </div>

              {/* Ranks list */}
              <div className="space-y-2.5">
                {faction.ranks.slice().reverse().map((rank) => (
                  <div
                    key={rank.level}
                    className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                      rank.isLeader
                        ? 'bg-amber-950/30 border-amber-800/80'
                        : rank.isDeputy
                        ? 'bg-cyan-950/30 border-cyan-800/80'
                        : 'bg-neutral-950/60 border-neutral-800/80 hover:bg-neutral-950'
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
                            <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded font-semibold">
                              Leader (Max 1)
                            </span>
                          )}
                          {rank.isDeputy && (
                            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.2 rounded font-semibold">
                              Deputy (3 DEPs Only)
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">{rank.responsibilities}</p>
                      </div>
                    </div>

                    {/* Deputy/Leader Slot status - no leader name or vacant */}
                    <div className="shrink-0 sm:text-right text-xs">
                      {rank.isLeader && (
                        <div className="text-amber-300 font-mono font-semibold">
                          Rank 10 Authority
                        </div>
                      )}
                      {rank.isDeputy && (
                        <div className="text-cyan-300 font-mono font-medium">
                          Rank 9 (Max 3 DEPs)
                        </div>
                      )}
                      {!rank.isLeader && !rank.isDeputy && (
                        <span className="text-neutral-500 font-mono text-[11px]">Enlisted Tier</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ROSTER & QUOTA ACTIVITY */}
          {activeTab === 'roster' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-[11px] text-neutral-500 block">Total Staff</span>
                  <span className="font-mono text-lg font-bold text-white tabular-nums">{faction.stats.activeMembers}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-[11px] text-neutral-500 block">On Duty Now</span>
                  <span className="font-mono text-lg font-bold text-emerald-400 tabular-nums">{faction.stats.onDutyNow}</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-[11px] text-neutral-500 block">Weekly Hours</span>
                  <span className="font-mono text-lg font-bold text-cyan-300 tabular-nums">{faction.stats.weeklyDutyHours} hrs</span>
                </div>
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                  <span className="text-[11px] text-neutral-500 block">Performance Grade</span>
                  <span className="font-mono text-lg font-bold text-emerald-400">{faction.stats.weeklyPerformanceGrade}</span>
                </div>
              </div>

              <div className="border border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] font-semibold border-b border-neutral-800 tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Member Nickname</th>
                      <th className="py-2.5 px-3">Rank Title</th>
                      <th className="py-2.5 px-3 text-right">Weekly Shift</th>
                      <th className="py-2.5 px-3 text-right">Quota Tasks</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-neutral-200">
                    {faction.members.filter((m) => m.rankLevel < 10).map((member) => (
                      <tr key={member.id} className="hover:bg-neutral-950/40">
                        <td className="py-2.5 px-3 font-mono font-medium text-white flex items-center gap-1.5">
                          <span>{member.name}</span>
                          {member.isDeputySlot && (
                            <span className="text-[9px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1 rounded font-sans">
                              DEP
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-400">{member.rankTitle}</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums">{member.dutyHoursThisWeek} hrs</td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-cyan-300">{member.completedTasks}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            member.status === 'on_duty'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}>
                            {member.status === 'on_duty' ? 'On Duty' : 'Off Duty'}
                          </span>
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
    </div>
  );
};

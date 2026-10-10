import React, { useState } from 'react';
import { FACTIONS_DATA } from '../data/factionsData';
import { AdminUser, Faction, FactionMemberRanking } from '../types/roleplay';
import { 
  ShieldCheck, 
  Lock, 
  BarChart3, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Award, 
  FileText, 
  Search, 
  Save, 
  Download,
  AlertTriangle,
  Edit3,
  UserCheck,
  Shield,
  Skull,
  UserPlus
} from 'lucide-react';

interface AdminDashboardProps {
  adminUser: AdminUser | null;
  factionsList: Faction[];
  setFactionsList: React.Dispatch<React.SetStateAction<Faction[]>>;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminUser,
  factionsList,
  setFactionsList,
  onOpenLogin,
  onLogout
}) => {
  // Determine available factions based on admin scope
  // scope: 'all' -> both state and ocg
  // scope: 'state' -> only state factions
  // scope: 'ocg' -> only ocg factions
  const canAccessState = adminUser?.scope === 'all' || adminUser?.scope === 'state';
  const canAccessOCG = adminUser?.scope === 'all' || adminUser?.scope === 'ocg';

  const accessibleFactions = factionsList.filter((f) => {
    if (adminUser?.scope === 'all') return true;
    if (adminUser?.scope === 'state') return f.sector === 'state';
    if (adminUser?.scope === 'ocg') return f.sector === 'ocg';
    return true;
  });

  const [activeSectorTab, setActiveSectorTab] = useState<'state' | 'ocg'>(
    adminUser?.scope === 'ocg' ? 'ocg' : 'state'
  );

  const displayedFactions = accessibleFactions.filter((f) => 
    adminUser?.scope === 'all' ? f.sector === activeSectorTab : true
  );

  const [selectedAuditFactionId, setSelectedAuditFactionId] = useState<string>(
    displayedFactions[0]?.id || accessibleFactions[0]?.id || factionsList[0].id
  );

  const currentAuditedFaction = factionsList.find((f) => f.id === selectedAuditFactionId) || factionsList[0];

  // Editable fields for the selected faction
  const [editLeaderName, setEditLeaderName] = useState(currentAuditedFaction.currentLeader);
  const [editDeputies, setEditDeputies] = useState<string[]>(currentAuditedFaction.deputies || []);
  const [newDeputyInput, setNewDeputyInput] = useState('');
  const [auditNotes, setAuditNotes] = useState(currentAuditedFaction.stats.curatorNotes || '');
  const [selectedGrade, setSelectedGrade] = useState(currentAuditedFaction.stats.weeklyPerformanceGrade);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Leaderboard filters
  const [leaderboardSearch, setLeaderboardSearch] = useState('');
  const [sortBy, setSortBy] = useState<'hours' | 'tasks' | 'commendations'>('hours');

  // Handle faction selection
  const handleSelectAuditFaction = (fId: string) => {
    setSelectedAuditFactionId(fId);
    const target = factionsList.find((f) => f.id === fId);
    if (target) {
      setEditLeaderName(target.currentLeader);
      setEditDeputies([...target.deputies]);
      setAuditNotes(target.stats.curatorNotes || '');
      setSelectedGrade(target.stats.weeklyPerformanceGrade);
      setSaveSuccessMsg(null);
    }
  };

  // Modify warning strikes
  const handleWarningChange = (delta: number) => {
    setFactionsList((prev) =>
      prev.map((f) => {
        if (f.id === selectedAuditFactionId) {
          const newCount = Math.max(0, Math.min(3, f.stats.warningsCount + delta));
          return {
            ...f,
            stats: {
              ...f.stats,
              warningsCount: newCount
            }
          };
        }
        return f;
      })
    );
  };

  // Add Deputy (strictly maximum 3 DEPs)
  const handleAddDeputy = () => {
    if (!newDeputyInput.trim()) return;
    if (editDeputies.length >= 3) {
      alert('Violation: Faction Deputy quota strictly capped at 3 DEPs maximum.');
      return;
    }
    setEditDeputies([...editDeputies, newDeputyInput.trim()]);
    setNewDeputyInput('');
  };

  // Remove Deputy
  const handleRemoveDeputy = (index: number) => {
    setEditDeputies(editDeputies.filter((_, idx) => idx !== index));
  };

  // Save changes
  const handleSaveFactionInspection = () => {
    if (!adminUser) return;

    setFactionsList((prev) =>
      prev.map((f) => {
        if (f.id === selectedAuditFactionId) {
          // Update faction leader in members list as well
          const updatedMembers = f.members.map((m) => {
            if (m.rankLevel === 10) {
              return { ...m, name: editLeaderName.trim() };
            }
            return m;
          });

          return {
            ...f,
            currentLeader: editLeaderName.trim(),
            deputies: editDeputies,
            members: updatedMembers,
            stats: {
              ...f.stats,
              curatorNotes: auditNotes,
              weeklyPerformanceGrade: selectedGrade
            }
          };
        }
        return f;
      })
    );

    setSaveSuccessMsg(`Changes & Leader details successfully saved for ${currentAuditedFaction.name} by ${adminUser.username}!`);
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Export report
  const handleExportReport = () => {
    const summary = {
      auditor: adminUser?.username,
      role: adminUser?.role,
      scope: adminUser?.scope,
      exportedAt: new Date().toISOString(),
      factionsStatus: accessibleFactions.map((f) => ({
        name: f.name,
        sector: f.sector,
        leader: f.currentLeader,
        deputies: f.deputies,
        weeklyHours: f.stats.weeklyDutyHours,
        onDuty: f.stats.onDutyNow,
        grade: f.stats.weeklyPerformanceGrade,
        warnings: `${f.stats.warningsCount}/3`,
        curatorNotes: f.stats.curatorNotes
      }))
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infinity_mobile_${adminUser?.scope || 'audit'}_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compile members for leaderboard
  const allAccessibleMembers: Array<FactionMemberRanking & { factionName: string; factionId: string; sector: string }> = [];
  accessibleFactions.forEach((f) => {
    f.members.forEach((m) => {
      allAccessibleMembers.push({
        ...m,
        factionName: f.shortName,
        factionId: f.id,
        sector: f.sector
      });
    });
  });

  const filteredLeaderboard = allAccessibleMembers
    .filter((m) =>
      m.name.toLowerCase().includes(leaderboardSearch.toLowerCase()) ||
      m.rankTitle.toLowerCase().includes(leaderboardSearch.toLowerCase()) ||
      m.factionName.toLowerCase().includes(leaderboardSearch.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'hours') return b.dutyHoursThisWeek - a.dutyHoursThisWeek;
      if (sortBy === 'tasks') return b.completedTasks - a.completedTasks;
      return b.commendations - a.commendations;
    });

  // If NOT signed in: render restricted security screen
  if (!adminUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-cyan-400 shadow-xl">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
            Internal Curator Access Only
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrative Oversight Dashboard
          </h2>
          <p className="text-sm text-neutral-400">
            Restricted to State Curators and OCG Curators. Authentication requires fixed server credentials to inspect faction leaders, member rankings, and department activities.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-6 py-3 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-400/20"
          >
            Authenticate as State / OCG Curator
          </button>
        </div>

        <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-1">
            <span className="text-xs font-bold text-sky-400 block">State Curators Jurisdiction</span>
            <span className="text-xs text-neutral-400">Government, APD, YPD, FSB, Military Unit ( Army ), News Network (NN/MEDIA), Hospital.</span>
          </div>
          <div className="p-4 bg-neutral-900/60 border border-neutral-800 rounded-xl space-y-1">
            <span className="text-xs font-bold text-rose-400 block">OCG Curators Jurisdiction</span>
            <span className="text-xs text-neutral-400">Tambov OCG, Caucasian OCG, Kurgan OCG.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Administration Session Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
            adminUser.scope === 'all'
              ? 'bg-amber-950/80 border-amber-700 text-amber-400'
              : adminUser.scope === 'state'
              ? 'bg-sky-950/80 border-sky-700 text-sky-400'
              : 'bg-rose-950/80 border-rose-700 text-rose-400'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                {adminUser.role === 'Chief Administrator' ? 'Supreme Administration Console' : `${adminUser.role} Portal`}
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold uppercase border ${
                adminUser.scope === 'all'
                  ? 'bg-amber-950 text-amber-300 border-amber-800'
                  : adminUser.scope === 'state'
                  ? 'bg-sky-950 text-sky-300 border-sky-800'
                  : 'bg-rose-950 text-rose-300 border-rose-800'
              }`}>
                {adminUser.scope === 'all' ? 'State + OCG Access' : `${adminUser.scope.toUpperCase()} Division`}
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Authenticated Call-Sign: <strong className="text-neutral-200 font-mono">{adminUser.username}</strong> · Level {adminUser.level} Clearance · Session logged at {adminUser.authenticatedAt}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 border border-neutral-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit JSON</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-800 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Scope Switcher for Chief Administrator */}
      {adminUser.scope === 'all' && (
        <div className="flex items-center justify-between p-3 bg-neutral-900/90 border border-amber-900/50 rounded-xl">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
            <span>Chief Admin Clearance Active (CA | Alex):</span>
            <span className="text-neutral-400 font-normal">You can monitor and modify both State and OCG factions.</span>
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-neutral-950 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setActiveSectorTab('state')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeSectorTab === 'state' ? 'bg-sky-950 text-sky-300 border border-sky-800' : 'text-neutral-400 hover:text-white'
              }`}
            >
              State Factions (6)
            </button>
            <button
              onClick={() => setActiveSectorTab('ocg')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeSectorTab === 'ocg' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'text-neutral-400 hover:text-white'
              }`}
            >
              OCG Factions (3)
            </button>
          </div>
        </div>
      )}

      {/* 1. Faction Health & Performance Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>Assigned Factions Quota & Leader Oversight</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Click any faction to modify leader name, review 3 Deputies, adjust disciplinary strikes, and issue directives.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedFactions.map((faction) => {
            const isAudited = faction.id === selectedAuditFactionId;
            return (
              <div
                key={faction.id}
                onClick={() => handleSelectAuditFaction(faction.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isAudited
                    ? 'bg-neutral-900 border-cyan-500 shadow-xl shadow-cyan-950/20'
                    : 'bg-neutral-900/60 hover:bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 block">
                        {faction.sector === 'state' ? 'State Organization' : 'Underground Syndicate'}
                      </span>
                      <h4 className="text-base font-bold text-white line-clamp-1">{faction.name}</h4>
                    </div>
                    <span className="font-mono text-xs px-2.5 py-1 bg-neutral-950 text-cyan-300 border border-neutral-800 rounded-md shrink-0 font-bold">
                      Grade: {faction.stats.weeklyPerformanceGrade}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 text-xs bg-neutral-950/70 p-3 rounded-xl border border-neutral-800">
                    <div>
                      <span className="text-neutral-500 block">Leader (Rank 10)</span>
                      <span className="font-mono text-white font-medium truncate block">
                        {faction.currentLeader}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Deputies (Rank 9)</span>
                      <span className="font-mono text-cyan-300 font-semibold">
                        {faction.deputies.length} / 3 DEPs
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">On Duty Now</span>
                      <span className="font-mono text-emerald-400 font-semibold tabular-nums">
                        {faction.stats.onDutyNow} of {faction.stats.activeMembers}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Disciplinary Strikes</span>
                      <span className={`font-mono font-bold tabular-nums ${
                        faction.stats.warningsCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}>
                        {faction.stats.warningsCount} / 3 Warns
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <span>Weekly: <strong className="text-neutral-300 font-mono">{faction.stats.weeklyDutyHours} hrs</strong></span>
                  <span className="text-cyan-400 hover:underline">
                    {isAudited ? 'Editing Below ↓' : 'Inspect & Edit →'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Curator Faction Editor & Activity Monitor */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5" />
              <span>Curator Faction Editor & Leader Oversight</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">
              Currently Auditing: {currentAuditedFaction.name}
            </h3>
            <p className="text-xs text-neutral-400">
              Authorized to modify Leader Name (Rank 10), assign up to 3 Deputies (Rank 9), and issue formal directives.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400">Switch Faction:</span>
            <select
              value={selectedAuditFactionId}
              onChange={(e) => handleSelectAuditFaction(e.target.value)}
              className="px-3 py-1.5 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {displayedFactions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.shortName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="p-3.5 bg-emerald-950/90 border border-emerald-800 rounded-xl text-xs sm:text-sm text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Faction Leader Name (Rank 10) Editor */}
          <div className="space-y-2 p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span>Faction Leader Name (Rank 10)</span>
              <span className="text-[10px] text-amber-400 uppercase font-mono">1 Leader Max</span>
            </label>
            <input
              type="text"
              value={editLeaderName}
              onChange={(e) => setEditLeaderName(e.target.value)}
              placeholder="e.g. Viktor_Romanov"
              className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
            <span className="text-[11px] text-neutral-500 block">
              Curator authorization required to transfer or appoint a new faction leader.
            </span>
          </div>

          {/* Deputies (Rank 9 - Strictly 3 DEPs only) */}
          <div className="space-y-2 p-4 bg-neutral-950 border border-neutral-800 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white">
                Faction Deputies (Rank 9)
              </label>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {editDeputies.length} / 3 DEPs Only
              </span>
            </div>

            <div className="space-y-1.5">
              {editDeputies.map((dep, idx) => (
                <div key={idx} className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs">
                  <span className="font-mono text-neutral-200">DEP #{idx + 1}: {dep}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDeputy(idx)}
                    className="text-neutral-500 hover:text-rose-400 text-xs px-1.5 py-0.5"
                    title="Remove deputy slot"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}

              {editDeputies.length < 3 && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newDeputyInput}
                    onChange={(e) => setNewDeputyInput(e.target.value)}
                    placeholder="Enter new Deputy nickname..."
                    className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddDeputy}
                    className="px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg text-xs font-semibold whitespace-nowrap"
                  >
                    + Add DEP
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Performance Grade & Disciplinary Strikes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white block">
              Performance Grade Evaluation
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['A+', 'A', 'B+', 'B', 'C', 'Review Required'].map((grade) => (
                <button
                  key={grade}
                  type="button"
                  onClick={() => setSelectedGrade(grade as any)}
                  className={`py-2 px-2 text-xs font-mono font-bold rounded-lg border text-center transition-colors ${
                    selectedGrade === grade
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white block">
              Official Leader Disciplinary Strikes (0/3)
            </label>
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl flex items-center justify-between">
              <div>
                <span className={`text-lg font-mono font-bold ${
                  currentAuditedFaction.stats.warningsCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {currentAuditedFaction.stats.warningsCount} / 3 Strikes
                </span>
                <span className="text-[11px] text-neutral-500 block">
                  {currentAuditedFaction.stats.warningsCount === 3
                    ? '3/3 Strikes: Mandatory Faction Leader Removal'
                    : 'Disciplinary warnings recorded'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleWarningChange(-1)}
                  disabled={currentAuditedFaction.stats.warningsCount === 0}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-xs text-white rounded font-mono"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => handleWarningChange(1)}
                  disabled={currentAuditedFaction.stats.warningsCount === 3}
                  className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 border border-rose-800 disabled:opacity-40 text-xs text-rose-200 rounded font-mono"
                >
                  +1
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Curator Inspection Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-white block">
            Curator Inspection Directives & Mandatory Actions
          </label>
          <textarea
            rows={3}
            value={auditNotes}
            onChange={(e) => setAuditNotes(e.target.value)}
            placeholder="Document recruitment wave quotas, leadership compliance, audit observations..."
            className="w-full p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveFactionInspection}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-cyan-400/20"
          >
            <Save className="w-4 h-4" />
            <span>Save Faction Updates & Leader Data</span>
          </button>
        </div>
      </div>

      {/* 3. Cross-Faction Member Rankings Leaderboard */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Cross-Faction Member Rankings & Shift Leaderboard</span>
            </h3>
            <p className="text-xs text-neutral-400">
              Verified weekly hours, completed quota assignments, and commendations in your jurisdiction.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search staff nickname..."
                value={leaderboardSearch}
                onChange={(e) => setLeaderboardSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-1 p-0.5 bg-neutral-900 border border-neutral-800 rounded-lg">
              <button
                onClick={() => setSortBy('hours')}
                className={`px-2.5 py-1 text-xs rounded-md ${
                  sortBy === 'hours' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Hours
              </button>
              <button
                onClick={() => setSortBy('tasks')}
                className={`px-2.5 py-1 text-xs rounded-md ${
                  sortBy === 'tasks' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setSortBy('commendations')}
                className={`px-2.5 py-1 text-xs rounded-md ${
                  sortBy === 'commendations' ? 'bg-neutral-800 text-white font-medium' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Commends
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto border border-neutral-800 rounded-2xl bg-neutral-900/60">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-neutral-950 text-neutral-400 uppercase text-[11px] font-semibold border-b border-neutral-800 tracking-wider">
              <tr>
                <th className="py-3 px-4">Rank #</th>
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Faction</th>
                <th className="py-3 px-4">Rank Level</th>
                <th className="py-3 px-4 text-right">Weekly Shift Hours</th>
                <th className="py-3 px-4 text-right">Tasks Completed</th>
                <th className="py-3 px-4 text-right">Commendations</th>
                <th className="py-3 px-4 text-center">Duty Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800 text-neutral-200">
              {filteredLeaderboard.map((member, idx) => (
                <tr key={`${member.factionId}-${member.id}`} className="hover:bg-neutral-950/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-neutral-400">
                    #{idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    {member.name}
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">
                    <span className="px-2 py-0.5 rounded text-[11px] bg-neutral-950 border border-neutral-800 text-neutral-300">
                      {member.factionName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400">
                    {member.rankTitle}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-semibold text-cyan-300">
                    {member.dutyHoursThisWeek} hrs
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-white">
                    {member.completedTasks}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-400 font-medium">
                    +{member.commendations}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

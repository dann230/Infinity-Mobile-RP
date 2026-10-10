import React, { useState, useEffect } from 'react';
import { INITIAL_COMPLAINTS } from '../data/factionsData';
import { PlayerComplaint, AdminUser } from '../types/roleplay';
import { 
  AlertTriangle, 
  Send, 
  Search, 
  ExternalLink, 
  Clock, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Filter,
  FileCheck2,
  HelpCircle
} from 'lucide-react';

interface ComplaintPanelProps {
  adminUser: AdminUser | null;
}

export const ComplaintPanel: React.FC<ComplaintPanelProps> = ({ adminUser }) => {
  const [complaints, setComplaints] = useState<PlayerComplaint[]>(() => {
    const saved = localStorage.getItem('infinity_complaints_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_COMPLAINTS;
      }
    }
    return INITIAL_COMPLAINTS;
  });

  const [activeView, setActiveView] = useState<'submit' | 'registry'>('registry');

  // Form states
  const [reporterName, setReporterName] = useState('');
  const [suspectName, setSuspectName] = useState('');
  const [suspectFaction, setSuspectFaction] = useState('Civilian');
  const [category, setCategory] = useState<PlayerComplaint['category']>('DM');
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Registry filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Admin verdict modal / inline state
  const [selectedComplaintForVerdict, setSelectedComplaintForVerdict] = useState<string | null>(null);
  const [verdictText, setVerdictText] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('infinity_complaints_v3', JSON.stringify(complaints));
  }, [complaints]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reporterName.trim()) {
      setFormError('Please enter your in-game nickname.');
      return;
    }
    if (!suspectName.trim()) {
      setFormError('Please enter the suspect player nickname.');
      return;
    }
    if (!reason.trim()) {
      setFormError('Please state the specific reason / rule violated.');
      return;
    }
    if (!evidenceUrl.trim()) {
      setFormError('Please provide an evidence link (YouTube, Imgur, screenshot, or video).');
      return;
    }

    const newComplaint: PlayerComplaint = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      reporterName: reporterName.trim(),
      suspectName: suspectName.trim(),
      suspectFaction,
      serverId: 'Server #01 (Arzamas)',
      category,
      reason: reason.trim(),
      evidenceUrl: evidenceUrl.trim(),
      description: description.trim() || 'No additional narrative provided.',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending'
    };

    setComplaints([newComplaint, ...complaints]);
    setSubmitSuccess(`Complaint filed successfully! Ticket Reference ID: ${newComplaint.id}`);
    setFormError(null);

    // Reset fields
    setReporterName('');
    setSuspectName('');
    setReason('');
    setEvidenceUrl('');
    setDescription('');

    // Switch to registry after a moment
    setTimeout(() => {
      setActiveView('registry');
      setSubmitSuccess(null);
    }, 2500);
  };

  // Admin Actions
  const handleAdminVerdict = (id: string, status: 'Approved' | 'Rejected') => {
    if (!adminUser) return;
    const finalVerdict = verdictText.trim() || (status === 'Approved' ? 'Complaint verified. Sanction applied.' : 'Rejected due to insufficient proof.');

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status,
            adminVerdict: finalVerdict,
            reviewedBy: `${adminUser.role} [${adminUser.username}]`
          };
        }
        return c;
      })
    );

    setSelectedComplaintForVerdict(null);
    setVerdictText('');
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch =
      c.suspectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.reporterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Sub-tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <span>Player Complaints & Rule Enforcement Panel</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            File official reports against players violating Infinity Mobile server rules (DM, DB, Non-RP, corruption).
          </p>
        </div>

        {/* View Switcher Button Group */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setActiveView('registry')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeView === 'registry'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Complaints Registry ({complaints.length})</span>
          </button>

          <button
            onClick={() => setActiveView('submit')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeView === 'submit'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>File New Complaint</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: SUBMIT COMPLAINT FORM */}
      {activeView === 'submit' && (
        <div className="max-w-3xl mx-auto bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white">
              Submit Player Complaint / Report
            </h3>
            <p className="text-xs text-neutral-400">
              Please provide complete details and valid video/screenshot evidence. False complaints are punishable.
            </p>
          </div>

          {submitSuccess && (
            <div className="p-4 bg-emerald-950/90 border border-emerald-800 rounded-xl text-xs sm:text-sm text-emerald-300 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{submitSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="p-3 bg-rose-950/90 border border-rose-800 rounded-xl text-xs text-rose-300">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Your Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Your In-Game Nickname *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mikhail_Gromov"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* Suspect Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Accused Player Nickname *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kirill_Dangerous"
                  value={suspectName}
                  onChange={(e) => setSuspectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Suspect Faction */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Accused Player Faction
                </label>
                <select
                  value={suspectFaction}
                  onChange={(e) => setSuspectFaction(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Civilian">Civilian / No Faction</option>
                  <option value="Government">Government</option>
                  <option value="APD / YPD">Police (APD / YPD)</option>
                  <option value="FSB">FSB (Federal Security Service)</option>
                  <option value="Military Unit">Military Unit (Army)</option>
                  <option value="NEWS NETWORK (NN)">NEWS NETWORK (NN) / Media</option>
                  <option value="Hospital (EMS)">Hospital (EMS)</option>
                  <option value="Organized Crime (OCG)">Organized Crime Groups (OCG)</option>
                </select>
              </div>

              {/* Violation Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Rule Violation Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="DM">Deathmatch (DM) — Killing without RP reason</option>
                  <option value="DB">Drive-By (DB) — Running over with vehicle</option>
                  <option value="PG">Powergaming (PG) — Unrealistic physical feats</option>
                  <option value="Non-RP">Non-RP Behavior / Command Abuse</option>
                  <option value="Corruption">State Corruption / Unlawful Arrest</option>
                  <option value="Off-duty Abuse">Off-Duty Weapon / Uniform Abuse</option>
                  <option value="OOC Insult">OOC Insult / Toxicity</option>
                  <option value="Other">Other Infraction</option>
                </select>
              </div>
            </div>

            {/* Violation Reason */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 block">
                Reason / Specific Infraction *
              </label>
              <input
                type="text"
                placeholder="e.g. Non-RP arrest without roleplay dialogue at central market"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Evidence Link */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300 block">
                  Evidence URL (Screenshot / Video Link) *
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-neutral-500">Quick test link:</span>
                  <button
                    type="button"
                    onClick={() => setEvidenceUrl('https://youtu.be/infinity-rp-evidence-demo')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    YouTube
                  </button>
                  <span className="text-neutral-600">·</span>
                  <button
                    type="button"
                    onClick={() => setEvidenceUrl('https://imgur.com/infinity-screenshot-proof')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Imgur
                  </button>
                </div>
              </div>
              <input
                type="url"
                placeholder="https://youtu.be/... or https://imgur.com/..."
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Narrative Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 block">
                Detailed Incident Description (Time, Context, Witnesses)
              </label>
              <textarea
                rows={3}
                placeholder="Describe what happened step-by-step during the roleplay encounter..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-amber-400/20"
              >
                <Send className="w-4 h-4" />
                <span>Submit Complaint for Review</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW 2: REGISTRY & VERDICT TRACKER */}
      {activeView === 'registry' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Search complaint by player, reason, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Status Filter:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Statuses ({complaints.length})</option>
                <option value="Pending">Pending Review</option>
                <option value="Approved">Approved & Sanctioned</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Complaints List */}
          {filteredComplaints.length > 0 ? (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => {
                const isVerdictOpen = selectedComplaintForVerdict === complaint.id;

                return (
                  <div
                    key={complaint.id}
                    className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-neutral-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-neutral-950 text-neutral-300 border border-neutral-800 rounded">
                          {complaint.id}
                        </span>
                        <span className="text-xs text-neutral-400">
                          Filed by <strong className="text-neutral-200">{complaint.reporterName}</strong>
                        </span>
                        <span aria-hidden="true" className="text-neutral-600">·</span>
                        <span className="text-xs text-neutral-500 font-mono">
                          {complaint.createdAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border font-mono ${
                          complaint.status === 'Approved'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                            : complaint.status === 'Rejected'
                            ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                            : 'bg-amber-950/80 text-amber-300 border-amber-800'
                        }`}>
                          {complaint.status === 'Approved' ? 'Approved (Sanctioned)' : complaint.status}
                        </span>
                      </div>
                    </div>

                    {/* Complaint Main Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">
                          Accused Suspect
                        </span>
                        <span className="font-mono font-bold text-white text-base">
                          {complaint.suspectName}
                        </span>
                        {complaint.suspectFaction && (
                          <span className="text-xs text-cyan-400 block mt-0.5">
                            {complaint.suspectFaction}
                          </span>
                        )}
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <span className="text-xs text-neutral-500 block uppercase tracking-wider font-semibold">
                          Infraction & Reason
                        </span>
                        <div className="font-semibold text-neutral-200">
                          [{complaint.category}] {complaint.reason}
                        </div>
                        <p className="text-xs text-neutral-400 leading-relaxed pt-1">
                          {complaint.description}
                        </p>
                      </div>
                    </div>

                    {/* Evidence & Links */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800/80 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Evidence Link:</span>
                        <a
                          href={complaint.evidenceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline font-mono"
                        >
                          <span>{complaint.evidenceUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {/* Admin action button if logged in */}
                      {adminUser && complaint.status === 'Pending' && !isVerdictOpen && (
                        <button
                          onClick={() => setSelectedComplaintForVerdict(complaint.id)}
                          className="px-3 py-1 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 rounded-lg text-xs font-semibold transition-colors"
                        >
                          Review & Issue Sanction →
                        </button>
                      )}
                    </div>

                    {/* Admin Verdict Section */}
                    {complaint.adminVerdict && (
                      <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Administrative Verdict</span>
                          {complaint.reviewedBy && (
                            <span className="text-neutral-500 font-normal">
                              by {complaint.reviewedBy}
                            </span>
                          )}
                        </div>
                        <p className="text-neutral-300 italic">
                          "{complaint.adminVerdict}"
                        </p>
                      </div>
                    )}

                    {/* Admin Action Form if expanding */}
                    {isVerdictOpen && adminUser && (
                      <div className="p-4 bg-neutral-950 rounded-xl border border-cyan-900/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-cyan-300">
                            Administrator Verdict Decision ({adminUser.username})
                          </span>
                          <button
                            onClick={() => setSelectedComplaintForVerdict(null)}
                            className="text-xs text-neutral-500 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>

                        <input
                          type="text"
                          placeholder="e.g. Demorgan 60 mins for DM in Green Zone / Warn granted..."
                          value={verdictText}
                          onChange={(e) => setVerdictText(e.target.value)}
                          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                        />

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAdminVerdict(complaint.id, 'Approved')}
                            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
                          >
                            Approve & Issue Sanction
                          </button>
                          <button
                            onClick={() => handleAdminVerdict(complaint.id, 'Rejected')}
                            className="px-4 py-1.5 bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-semibold text-xs rounded-lg transition-colors"
                          >
                            Reject (Insufficient Evidence)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-14 px-4 border border-dashed border-neutral-800 rounded-2xl space-y-3 bg-neutral-950/40">
              <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white font-mono">
                  0 Complaints Received
                </h4>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  No player complaints have been received, pending, or resolved. All server participant records are currently clean.
                </p>
              </div>
              <button
                onClick={() => setActiveView('submit')}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs rounded-lg transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit First Report</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

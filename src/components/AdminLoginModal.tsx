import React, { useState } from 'react';
import { AdminUser, CuratorRoleType } from '../types/roleplay';
import { Lock, X, Shield, KeyRound, AlertCircle, Info, ChevronDown, Check } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: AdminUser) => void;
}

const CURATOR_ROLES: CuratorRoleType[] = [
  'Curator for Faction',
  'Senior Curator of Faction',
  'Deputy Senior Curator of Faction',
  'Senior Curator of Crime/State Organization',
  'Deputy Chief Administrator',
  'Chief Administrator',
];

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin
}) => {
  const [loginDomain, setLoginDomain] = useState<'state' | 'ocg'>('state');
  const [username, setUsername] = useState('Admin');
  const [nickname, setNickname] = useState('');
  const [selectedRole, setSelectedRole] = useState<CuratorRoleType>('Curator for Faction');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showHelper, setShowHelper] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Fixed credentials check:
    // Username: "Admin" (or "Admin" for state / ocg)
    // Password: "Infinity Mobile Roleplay"
    const cleanedUser = username.trim();
    const cleanedPass = password.trim();

    if (cleanedUser.toLowerCase() !== 'admin') {
      setError('Access Denied: Invalid Administrative Username. Fixed credential required.');
      return;
    }

    if (cleanedPass !== 'Infinity Mobile Roleplay') {
      setError('Access Denied: Invalid Security Passkey. Fixed curator credentials required.');
      return;
    }

    if (!nickname.trim()) {
      setError('Please fill in your Admin In-Game Nickname (e.g. CA | Alex).');
      return;
    }

    const trimmedNick = nickname.trim();

    // Check if Chief Administrator or CA| Alex
    const isChiefAdmin = 
      selectedRole === 'Chief Administrator' || 
      trimmedNick.toLowerCase().includes('alex') || 
      trimmedNick.toUpperCase().includes('CA|');

    const determinedScope: 'all' | 'state' | 'ocg' = isChiefAdmin 
      ? 'all' 
      : loginDomain === 'state' 
      ? 'state' 
      : 'ocg';

    onLogin({
      username: trimmedNick,
      loginId: cleanedUser,
      scope: determinedScope,
      role: selectedRole,
      level: isChiefAdmin ? 5 : selectedRole === 'Deputy Chief Administrator' ? 5 : 4,
      authenticatedAt: new Date().toLocaleTimeString()
    });

    onClose();
  };

  // Quick preset loader for reviewer testing
  const applyPreset = (presetNick: string, presetRole: CuratorRoleType, domain: 'state' | 'ocg') => {
    setLoginDomain(domain);
    setUsername('Admin');
    setNickname(presetNick);
    setSelectedRole(presetRole);
    setPassword('Infinity Mobile Roleplay');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative my-auto animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800"
          title="Close window"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 text-center">
          <div className="w-12 h-12 bg-neutral-950 border border-neutral-800 text-cyan-400 rounded-xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Curator & Administration Authentication
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Secured server portal. Fixed permanent credentials required to monitor faction activities and manage department leadership.
          </p>
        </div>

        {/* Division Switcher: State Curators vs OCG Curators */}
        <div className="grid grid-cols-2 p-1 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setLoginDomain('state');
              setError(null);
            }}
            className={`py-2 px-3 rounded-lg transition-all ${
              loginDomain === 'state'
                ? 'bg-neutral-800 text-cyan-300 shadow-sm border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            State Curators Login
          </button>

          <button
            type="button"
            onClick={() => {
              setLoginDomain('ocg');
              setError(null);
            }}
            className={`py-2 px-3 rounded-lg transition-all ${
              loginDomain === 'ocg'
                ? 'bg-neutral-800 text-rose-300 shadow-sm border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            OCG Curators Login
          </button>
        </div>

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-xs text-rose-300 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Fixed Username */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>Admin Username</span>
              <span className="text-[11px] text-neutral-500 font-normal">Fixed Login</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* In-Game Nickname */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>Admin In-Game Nickname *</span>
              <span className="text-[11px] text-cyan-400 font-mono">e.g. CA | Alex</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="e.g. CA | Alex or Lev_Romanov"
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Assigned Curator Role */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300 block">
              Assigned Curator Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as CuratorRoleType)}
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {CURATOR_ROLES.map((role) => (
                <option key={role} value={role}>
                  {role === 'Deputy Chief Administrator' ? `${role} (Vacant - Not Yet Hired)` : role}
                </option>
              ))}
            </select>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>Password</span>
              <span className="text-[11px] text-neutral-500 font-normal">Secret Curator Key</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter permanent curator password..."
              className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-md shadow-cyan-400/20"
          >
            Authenticate & Open {loginDomain === 'state' ? 'State' : 'OCG'} Faction Dashboard
          </button>
        </form>

        {/* Curator Verification Guide Accordion */}
        <div className="pt-2 border-t border-neutral-800/80">
          <button
            type="button"
            onClick={() => setShowHelper(!showHelper)}
            className="w-full flex items-center justify-between text-left text-xs text-neutral-400 hover:text-neutral-200"
          >
            <span className="flex items-center gap-1.5 font-medium">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>Permanent Credentials Quick Autofill</span>
            </span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showHelper ? 'rotate-180' : ''}`} />
          </button>

          {showHelper && (
            <div className="mt-3 p-3 bg-neutral-950 border border-neutral-800 rounded-xl space-y-2 text-xs text-neutral-300">
              <div className="space-y-1">
                <p><strong>Fixed Username:</strong> <code className="text-cyan-300">Admin</code></p>
                <p><strong>Fixed Password:</strong> <code className="text-cyan-300">Infinity Mobile Roleplay</code></p>
              </div>

              <div className="pt-2 border-t border-neutral-800/80 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset('CA | Alex', 'Chief Administrator', 'state')}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-[11px] rounded text-emerald-300 font-semibold"
                >
                  Autofill CA | Alex (Super Admin)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Lev_Romanov', 'Curator for Faction', 'state')}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-[11px] rounded text-sky-300 font-semibold"
                >
                  Autofill State Curator
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Dmitry_Volkov', 'Senior Curator of Crime/State Organization', 'ocg')}
                  className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-[11px] rounded text-rose-300 font-semibold"
                >
                  Autofill OCG Curator
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

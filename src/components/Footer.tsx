import React from 'react';
import { Smartphone, ExternalLink, HelpCircle } from 'lucide-react';
import infinityLogo from '../assets/images/infinity_logo.png';

interface FooterProps {
  onNavigate: (tab: 'factions' | 'dresscode' | 'complaints' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-3 text-white font-bold text-base">
              <img
                src={infinityLogo}
                alt="Infinity Mobile Logo"
                className="w-7 h-7 rounded-lg object-cover border border-neutral-800"
              />
              <span>Infinity Mobile</span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              The official roleplay simulation portal for Infinity Mobile. Comprehensive faction command documentation, staff dress codes, player reporting system, and administrative oversight.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
              <span>Infinity Mobile Roleplay</span>
              <span aria-hidden="true">·</span>
              <span>Mobile Client Version 2.4</span>
            </div>
          </div>

          {/* Portal Navigation */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Portal Directory
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('factions')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Faction Commands Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dresscode')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Staff Dress Codes (Male & Female)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('complaints')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Player Complaints Panel
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Administrative Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Factions Covered */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider">
              Departments & Factions
            </h4>
            <div className="text-xs text-neutral-400 space-y-1">
              <p>Government</p>
              <p>Arzamas Police Department (APD)</p>
              <p>Yuzhny Police Department (YPD)</p>
              <p>FSB (Federal Security Service)</p>
              <p>Military Unit ( Army )</p>
              <p>News Network (NN/MEDIA)</p>
              <p>Hospital (EMS)</p>
              <p>Tambov OCG · Caucasian OCG · Kurgan OCG</p>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Infinity Mobile Roleplay. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Fair Play & Anti-Blat Protocol</span>
            <span>·</span>
            <span>Server Rules 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

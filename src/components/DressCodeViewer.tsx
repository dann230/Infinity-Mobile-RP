import React, { useState } from 'react';
import { Faction, UniformItem } from '../types/roleplay';
import { Shirt, CheckCircle2, XCircle, Shield, Sparkles, User, Users } from 'lucide-react';

interface DressCodeViewerProps {
  faction: Faction;
}

export const DressCodeViewer: React.FC<DressCodeViewerProps> = ({ faction }) => {
  const [selectedGender, setSelectedGender] = useState<'both' | 'male' | 'female'>('both');

  const maleList = faction.dressCode.maleUniforms;
  const femaleList = faction.dressCode.femaleUniforms;

  const renderUniformCard = (item: UniformItem, idx: number) => {
    const isMale = item.gender === 'male';
    return (
      <div 
        key={`${item.gender}-${idx}`} 
        className="bg-neutral-900/70 border border-neutral-800 rounded-xl p-5 hover:border-neutral-700 transition-all flex flex-col justify-between"
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                <span className={isMale ? 'text-sky-400' : 'text-rose-400'}>
                  {isMale ? 'Male Staff' : 'Female Staff'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-neutral-300">{item.rankRange}</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">{item.title}</h4>
            </div>

            <span className="font-mono text-xs px-2.5 py-1 bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-md shrink-0 font-medium">
              {item.skinId}
            </span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            {item.description}
          </p>

          <div className="space-y-2 pt-2 border-t border-neutral-800/80">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Required Regulation Gear
            </span>
            <div className="flex flex-wrap gap-1.5">
              {item.requiredGear.map((gear, gIdx) => (
                <span 
                  key={gIdx} 
                  className="text-xs bg-neutral-950 text-neutral-300 px-2 py-0.5 rounded border border-neutral-800 font-mono"
                >
                  {gear}
                </span>
              ))}
            </div>
          </div>
        </div>

        {item.notes && (
          <div className="mt-4 pt-3 border-t border-neutral-800/50 text-xs text-neutral-400 italic">
            Note: {item.notes}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header & Gender Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Shirt className="w-5 h-5 text-cyan-400" />
            <span>{faction.shortName} Official Dress Code & Uniforms</span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Standard issue operational attire, formal service wear, and regulation skin IDs for staff.
          </p>
        </div>

        {/* Gender Filter Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg self-start sm:self-auto">
          <button
            onClick={() => setSelectedGender('both')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedGender === 'both'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>All Staff</span>
          </button>

          <button
            onClick={() => setSelectedGender('male')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedGender === 'male'
                ? 'bg-sky-950/80 text-sky-300 border border-sky-800/50 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span>Male Staff</span>
          </button>

          <button
            onClick={() => setSelectedGender('female')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              selectedGender === 'female'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-rose-400" />
            <span>Female Staff</span>
          </button>
        </div>
      </div>

      {/* Uniform Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {(selectedGender === 'both' || selectedGender === 'male') &&
          maleList.map((item, idx) => renderUniformCard(item, idx))}

        {(selectedGender === 'both' || selectedGender === 'female') &&
          femaleList.map((item, idx) => renderUniformCard(item, idx))}
      </div>

      {/* Regulations & Prohibited Items split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Uniform Regulations */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Mandatory Uniform Regulations</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
            {faction.dressCode.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-emerald-400 text-sm leading-tight">•</span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prohibited Items */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
            <XCircle className="w-4 h-4 shrink-0" />
            <span>Strictly Prohibited & Non-RP Accessories</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-neutral-300">
            {faction.dressCode.prohibitedItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-rose-400 text-sm leading-tight">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

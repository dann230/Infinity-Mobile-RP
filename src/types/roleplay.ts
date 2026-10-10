export type FactionId = 
  | 'government'
  | 'apd'
  | 'ypd'
  | 'fsb'
  | 'military'
  | 'news_network'
  | 'hospital'
  | 'tambov_ocg'
  | 'caucasian_ocg'
  | 'kurgan_ocg';

export type FactionSector = 'state' | 'ocg';

export type FactionCategory = 
  | 'state_gov' 
  | 'law_enforcement' 
  | 'military' 
  | 'media' 
  | 'medical' 
  | 'underground';

export interface CommandItem {
  id: string;
  command: string;
  description: string;
  syntax?: string;
  minRank?: string;
  category: 'core' | 'tactical' | 'duty' | 'economy' | 'broadcast' | 'administration';
  tip?: string;
}

export interface UniformItem {
  rankRange: string;
  title: string;
  skinId: string;
  gender: 'male' | 'female';
  description: string;
  requiredGear: string[];
  notes?: string;
}

export interface FactionDressCode {
  rules: string[];
  prohibitedItems: string[];
  maleUniforms: UniformItem[];
  femaleUniforms: UniformItem[];
}

export interface FactionRankTier {
  level: number; // 1 to 10
  title: string;
  isLeader?: boolean;
  isDeputy?: boolean; // Rank 9 has max 3 deputies
  maxHolders?: number; // e.g. 1 for Leader, 3 for Deputy
  responsibilities: string;
}

export interface FactionMemberRanking {
  id: string;
  name: string;
  rankTitle: string;
  rankLevel: number;
  dutyHoursThisWeek: number;
  completedTasks: number;
  infractions: number;
  status: 'active' | 'on_duty' | 'off_duty' | 'leave';
  commendations: number;
  isDeputySlot?: boolean;
}

export interface FactionStats {
  activeMembers: number;
  onDutyNow: number;
  weeklyDutyHours: number;
  budgetBalance: string;
  warehouseStock: string;
  quotaCompletionPercent: number;
  weeklyPerformanceGrade: 'A+' | 'A' | 'B+' | 'B' | 'C' | 'Review Required';
  curatorNotes?: string;
  warningsCount: number; // e.g. 0/3, 1/3
}

export interface Faction {
  id: FactionId;
  name: string;
  shortName: string;
  sector: FactionSector; // 'state' or 'ocg'
  category: FactionCategory;
  tagline: string;
  leaderTitle: string;
  currentLeader: string;
  deputies: string[]; // Up to 3 Deputies only
  badgeImage: string;
  accentColor: string;
  ranks: FactionRankTier[]; // Fixed 1 to 10
  commands: CommandItem[];
  dressCode: FactionDressCode;
  stats: FactionStats;
  members: FactionMemberRanking[];
}

export interface PlayerComplaint {
  id: string;
  reporterName: string;
  suspectName: string;
  suspectFaction?: string;
  serverId?: string;
  reason: string;
  category: 'DM' | 'DB' | 'PG' | 'Non-RP' | 'Corruption' | 'Off-duty Abuse' | 'OOC Insult' | 'Other';
  evidenceUrl: string;
  description: string;
  createdAt: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected';
  adminVerdict?: string;
  reviewedBy?: string;
}

export type CuratorRoleType =
  | 'Curator for Faction'
  | 'Senior Curator of Faction'
  | 'Deputy Senior Curator of Faction'
  | 'Senior Curator of Crime/State Organization'
  | 'Deputy Chief Administrator'
  | 'Chief Administrator';

export interface AdminUser {
  username: string; // filled in nickname e.g. "CA | Alex" or "Alex_Romanov"
  loginId: string; // "Admin" or "OCG_Admin"
  scope: 'state' | 'ocg' | 'all'; // Chief Admin has 'all'
  role: CuratorRoleType;
  level: number;
  authenticatedAt: string;
}

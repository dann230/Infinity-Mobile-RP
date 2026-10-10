import { Faction, FactionRankTier, PlayerComplaint, CommandItem } from '../types/roleplay';

// Generated visual badge assets
import policeBadge from '../assets/images/faction_badge_law_1791582900726.jpg';
import medicBadge from '../assets/images/faction_badge_medic_1791582912698.jpg';
import armyBadge from '../assets/images/faction_badge_army_1791582924311.jpg';
import syndicateBadge from '../assets/images/faction_badge_syndicate_1791582934746.jpg';

// Shared OCG commands list for Tambov, Caucasian, and Kurgan
const OCG_SHARED_COMMANDS = [
  {
    id: 'ocg-1',
    command: '/fmenu',
    description: 'Crime family syndicate dashboard (turf control, warehouse stash, cartel ranks).',
    syntax: '/fmenu',
    minRank: 'Rank 1+ (Novice)',
    category: 'core' as const,
  },
  {
    id: 'ocg-2',
    command: '/f [text]',
    description: 'Encrypted criminal syndicate radio frequency.',
    syntax: '/f [Encrypted Message]',
    minRank: 'Rank 1+',
    category: 'tactical' as const,
  },
  {
    id: 'ocg-3',
    command: '/tie [id]',
    description: 'Tie up hostage / captive player hands with heavy nautical rope.',
    syntax: '/tie [Player ID]',
    minRank: 'Rank 2+ (Fighter)',
    category: 'tactical' as const,
    tip: 'Target must be restrained or held at gunpoint in roleplay.'
  },
  {
    id: 'ocg-4',
    command: '/untie [id]',
    description: 'Untie hostage ropes after ransom payment or conclusion of scenario.',
    syntax: '/untie [Player ID]',
    minRank: 'Rank 2+',
    category: 'tactical' as const,
  },
  {
    id: 'ocg-5',
    command: '/gag [id]',
    description: 'Gag captive player mouth with cloth to prevent shouting.',
    syntax: '/gag [Player ID]',
    minRank: 'Rank 2+',
    category: 'tactical' as const,
  },
  {
    id: 'ocg-6',
    command: '/ungag [id]',
    description: 'Remove cloth gag from captive.',
    syntax: '/ungag [Player ID]',
    minRank: 'Rank 2+',
    category: 'tactical' as const,
  },
  {
    id: 'ocg-7',
    command: '/bag [id]',
    description: 'Place heavy black burlap bag over hostage head to blindfold vision.',
    syntax: '/bag [Player ID]',
    minRank: 'Rank 2+',
    category: 'tactical' as const,
  },
  {
    id: 'ocg-8',
    command: '/unbag [id]',
    description: 'Remove blindfold bag from hostage head.',
    syntax: '/unbag [Player ID]',
    minRank: 'Rank 2+',
    category: 'tactical' as const,
  },
  {
    id: 'ocg-9',
    command: '/bizwar',
    description: 'Declare scheduled commercial territory / business war against rival syndicate.',
    syntax: '/bizwar [Business ID]',
    minRank: 'Rank 8+ (Brigadier / Deputy)',
    category: 'tactical' as const,
    tip: 'Fought in designated zones with strict weapon regulations.'
  },
  {
    id: 'ocg-10',
    command: '/capture',
    description: 'Start territory capture countdown in contested ghetto neighborhood.',
    syntax: '/capture',
    minRank: 'Rank 7+ (Captain)',
    category: 'tactical' as const,
  },
  {
    id: 'ocg-11',
    command: '/robbery',
    description: 'Initiate coordinated heist on bank vault, warehouse, or military ammunition convoy.',
    syntax: '/robbery',
    minRank: 'Rank 7+',
    category: 'tactical' as const,
  },
  {
    id: 'ocg-12',
    command: '/fwarehouse',
    description: 'Access syndicate underground armory stash (contraband weapons, drugs, cash).',
    syntax: '/fwarehouse',
    minRank: 'Rank 1+',
    category: 'core' as const,
  },
  {
    id: 'ocg-13',
    command: '/fdeposit [amount] & /fwithdraw [amount]',
    description: 'Deposit dirty cash into common syndicate slush fund / withdraw operations budget.',
    syntax: '/fdeposit [Amount] | /fwithdraw [Amount]',
    minRank: 'Rank 1+ (Deposit) / Rank 9-10 (Withdraw)',
    category: 'economy' as const,
  },
  {
    id: 'ocg-14',
    command: '/makegun [name] [ammo]',
    description: 'Craft illegal firearms using stolen military metal materials.',
    syntax: '/makegun [Deagle / Shotgun / AK47 / M4 / Sniper] [Ammo Count]',
    minRank: 'Rank 3+ (Gunsmith)',
    category: 'tactical' as const,
  },
  {
    id: 'ocg-15',
    command: '/sellgun [id] [price]',
    description: 'Sell crafted black market weapon to buyer player.',
    syntax: '/sellgun [Player ID] [Price]',
    minRank: 'Rank 3+',
    category: 'economy' as const,
  },
  {
    id: 'ocg-16',
    command: '/selldrugs [id] [grams] [price]',
    description: 'Sell contraband narcotics to player in underground economy.',
    syntax: '/selldrugs [Player ID] [Grams] [Price]',
    minRank: 'Rank 2+',
    category: 'economy' as const,
  },
  {
    id: 'ocg-17',
    command: '/finvite [id] & /funinvite [id]',
    description: 'Induct initiate into crime family / exile former member.',
    syntax: '/finvite [Player ID] | /funinvite [Player ID] [Reason]',
    minRank: 'Rank 9-10 (Deputy / Leader)',
    category: 'administration' as const,
  },
  {
    id: 'ocg-18',
    command: '/wave [your id] [location and requirements]',
    description: 'Undercover recruitment announcement (disguised as private security company interview).',
    syntax: '/wave [Your ID] [Interview Location & Requirements]',
    minRank: 'Rank 9-10 (Deputy / Leader)',
    category: 'broadcast' as const,
  }
];

// Helper to create standard 1-10 ranks with Leader at 10 and Deputy (3 DEPs) at 9
const createRanks = (
  rankTitles: [string, string, string, string, string, string, string, string, string, string]
): FactionRankTier[] => [
  { level: 1, title: rankTitles[0], responsibilities: 'Entry-level duties, training probation, and direct task execution.' },
  { level: 2, title: rankTitles[1], responsibilities: 'Junior operations, squad support, and basic faction command authorization.' },
  { level: 3, title: rankTitles[2], responsibilities: 'Regular specialist duty, field participation, and routine patrol tasks.' },
  { level: 4, title: rankTitles[3], responsibilities: 'Senior specialist, mentor to junior recruits, operational assistance.' },
  { level: 5, title: rankTitles[4], responsibilities: 'Junior officer / tactical specialist, equipment access, field squad leader.' },
  { level: 6, title: rankTitles[5], responsibilities: 'Mid-tier officer, inspection rights, disciplinary field supervisor.' },
  { level: 7, title: rankTitles[6], responsibilities: 'Senior officer, unit lead, tactical operation coordinator.' },
  { level: 8, title: rankTitles[7], responsibilities: 'Head of department division, candidate interview assessor, staff supervisor.' },
  { 
    level: 9, 
    title: rankTitles[8], 
    isDeputy: true, 
    maxHolders: 3, 
    responsibilities: 'Deputy Leader (Strict limit: 3 DEPs only). Authorized for recruitment, promotions, departmental command & emergency leadership.' 
  },
  { 
    level: 10, 
    title: rankTitles[9], 
    isLeader: true, 
    maxHolders: 1, 
    responsibilities: 'Supreme Faction Leader. Complete organizational command, policy enforcement, treasury oversight & curator reporting.' 
  }
];

// Shared Police Commands for APD & YPD
const POLICE_SHARED_COMMANDS: CommandItem[] = [
  { id: 'pd-1', command: '/pdmenu', description: 'Open tactical Police Department terminal.', syntax: '/pdmenu', minRank: 'Rank 1+ (Cadet)', category: 'core' },
  { id: 'pd-2', command: '/pduty', description: 'Clock in / clock out of official police shift duty.', syntax: '/pduty', minRank: 'Rank 1+ (Cadet)', category: 'duty' },
  { id: 'pd-3', command: '/d [text]', description: 'Transmit over inter-departmental emergency radio channel.', syntax: '/d [APD/YPD to Faction] [Message]', minRank: 'Rank 3+ (Sergeant)', category: 'tactical' },
  { id: 'pd-4', command: '/bkpd', description: 'Request police backup with high-priority GPS distress beacon.', syntax: '/bkpd', minRank: 'Rank 2+', category: 'tactical' },
  { id: 'pd-5', command: '/cbkpd', description: 'Cancel active police backup request.', syntax: '/cbkpd', minRank: 'Rank 2+', category: 'tactical' },
  { id: 'pd-6', command: '/mpd [text]', description: 'Police megaphone loudspeaker for vehicle stops.', syntax: '/mpd [Warning text]', minRank: 'Rank 2+', category: 'tactical' },
  { id: 'pd-7', command: '/cuff', description: 'Restrain a detained suspect with handcuffs.', syntax: '/cuff [Player ID]', minRank: 'Rank 2+', category: 'tactical' },
  { id: 'pd-8', command: '/uncuff', description: 'Unlock handcuffs and release suspect restraints.', syntax: '/uncuff [Player ID]', minRank: 'Rank 2+', category: 'tactical' },
  { id: 'pd-9', command: '/putpl', description: 'Place handcuffed suspect into police cruiser rear seat.', syntax: '/putpl [Player ID] [Seat 2-3]', minRank: 'Rank 2+', category: 'tactical' },
  { id: 'pd-10', command: '/search', description: 'Search detained player for weapons, drugs, materials.', syntax: '/search [Player ID]', minRank: 'Rank 3+', category: 'tactical' },
  { id: 'pd-11', command: '/su', description: 'Issue criminal wanted stars with penal code reason.', syntax: '/su [Player ID] [Stars 1-6] [Reason]', minRank: 'Rank 2+', category: 'tactical' },
  { id: 'pd-12', command: '/clear', description: 'Remove player from wanted list upon verified reason.', syntax: '/clear [Player ID] [Reason]', minRank: 'Rank 5+ (Lieutenant)', category: 'tactical' },
  { id: 'pd-13', command: '/wanted', description: 'Display wanted criminal list database.', syntax: '/wanted', minRank: 'Rank 1+', category: 'core' },
  { id: 'pd-14', command: '/setmark', description: 'Track suspect GPS location blip.', syntax: '/setmark [Player ID]', minRank: 'Rank 3+', category: 'tactical' },
  { id: 'pd-15', command: '/arrest', description: 'Jail a player at precinct holding cell or prison.', syntax: '/arrest [Player ID] [Minutes] [Fine]', minRank: 'Rank 3+', category: 'tactical' },
  { id: 'pd-16', command: '/takelic', description: 'Confiscate driver or firearm license from offender.', syntax: '/takelic [Player ID] [License type]', minRank: 'Rank 4+', category: 'tactical' },
  { id: 'pd-17', command: '/ticket', description: 'Issue traffic infraction fine.', syntax: '/ticket [Player ID] [Fine] [Reason]', minRank: 'Rank 2+', category: 'tactical' },
  { id: 'pd-18', command: '/tickets', description: 'View traffic citations archive.', syntax: '/tickets', minRank: 'Rank 2+', category: 'core' },
  { id: 'pd-19', command: '/ptickets', description: 'View pending unpaid tickets for vehicle plate.', syntax: '/ptickets [Player ID / Plate]', minRank: 'Rank 2+', category: 'core' },
  { id: 'pd-20', command: '/delticket', description: 'Void or delete ticket upon verified contestation.', syntax: '/delticket [Ticket ID] [Reason]', minRank: 'Rank 6+', category: 'administration' },
  { id: 'pd-21', command: '/wave [your id] [location and requirements]', description: 'Police recruitment announcement.', syntax: '/wave [Your ID] [Requirements]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'broadcast' }
];

const POLICE_SHARED_DRESS_CODE = {
  rules: [
    'Officers on duty must wear assigned patrol uniform with Kevlar body armor equipped.',
    'Police badge number and surname patch must remain clearly displayed.',
    'Balaclavas are restricted strictly to SWAT operations during raids.',
    'Driving personal vehicles in uniform is strictly prohibited.'
  ],
  prohibitedItems: ['Street beanies, civilian caps, glowing sunglasses', 'Party masks, neon accessories'],
  maleUniforms: [
    { rankRange: 'Ranks 1–2', title: 'Cadet / Junior Sergeant', skinId: 'Skin ID #280', gender: 'male' as const, description: 'Standard blue patrol duty shirt, cadet epaulettes, utility belt with cuffs and baton.', requiredGear: ['Cadet Badge', 'Duty Belt', 'Handcuffs & Baton'] },
    { rankRange: 'Ranks 3–6', title: 'Sergeant / Lieutenant (Patrol Division)', skinId: 'Skin ID #265 / #266', gender: 'male' as const, description: 'Tactical dark navy field uniform, reinforced Kevlar vest, body camera, holster.', requiredGear: ['AXON Bodycam', 'Kevlar Vest', 'Sidearm & Taser'] },
    { rankRange: 'Ranks 7–8', title: 'Captain / Major (SWAT Tactical Unit)', skinId: 'Skin ID #285', gender: 'male' as const, description: 'Heavy tactical assault rig, ceramic plate carrier, ballistic helmet with comms.', requiredGear: ['Ballistic Helmet', 'Assault Vest', 'Tactical Carbine'] },
    { rankRange: 'Rank 9–10', title: 'Colonel / General of Police (3 DEPs & Leader)', skinId: 'Skin ID #288', gender: 'male' as const, description: 'Ceremonial dark blue officer dress tunic with golden epaulettes, service ribbons.', requiredGear: ['Gold Crest', 'Gilded Holster', 'Department Radio'] }
  ],
  femaleUniforms: [
    { rankRange: 'Ranks 1–2', title: 'Cadet / Junior Sergeant', skinId: 'Skin ID #211', gender: 'female' as const, description: 'Tailored dark navy patrol blouse, tactical trousers, duty belt, peaked beret.', requiredGear: ['Service Badge', 'Patrol Belt', 'Radio'] },
    { rankRange: 'Ranks 3–6', title: 'Sergeant / Lieutenant (Field Inspector)', skinId: 'Skin ID #306', gender: 'female' as const, description: 'Reinforced dark patrol tactical uniform, fitted Kevlar vest, bodycam, holster.', requiredGear: ['Bodycam', 'Fitted Kevlar', 'Sidearm & Taser'] },
    { rankRange: 'Ranks 7–8', title: 'Captain / Major (Tactical Officer)', skinId: 'Skin ID #309', gender: 'female' as const, description: 'Full black tactical assault jumpsuit, modular Molle plate carrier, helmet.', requiredGear: ['Ballistic Visor', 'Molle Vest', 'Tactical Radio'] },
    { rankRange: 'Rank 9–10', title: 'Colonel / Deputy Chief (3 DEPs & Leader)', skinId: 'Skin ID #219', gender: 'female' as const, description: 'Ceremonial officer tunic with gold aiguillette, dark blue dress slacks/skirt.', requiredGear: ['Executive Badge', 'Engraved Sidearm', 'Command Radio'] }
  ]
};

export const FACTIONS_DATA: Faction[] = [
  // 1. GOVERNMENT
  {
    id: 'government',
    name: 'Government',
    shortName: 'Government',
    sector: 'state',
    category: 'state_gov',
    tagline: 'Executive State Authority, Legislative Oversight & Fiscal Treasury',
    leaderTitle: 'Governor (Rank 10)',
    currentLeader: 'Eleano_Siling',
    deputies: ['Elena_Voronova', 'Mikhail_Gromov', 'Sergey_Ignatov'],
    badgeImage: policeBadge,
    accentColor: '#38bdf8',
    stats: {
      activeMembers: 38,
      onDutyNow: 14,
      weeklyDutyHours: 412,
      budgetBalance: '₽ 84,250,000',
      warehouseStock: '94,500 units',
      quotaCompletionPercent: 96,
      weeklyPerformanceGrade: 'A+',
      curatorNotes: 'Treasury balanced, tax rate maintained at 12%. Regular public ministerial reception held weekly.',
      warningsCount: 0,
    },
    ranks: createRanks([
      'Rank 1: Trainee Clerk',
      'Rank 2: Security Guard',
      'Rank 3: Administrative Clerk',
      'Rank 4: State Inspector',
      'Rank 5: Licensing Specialist',
      'Rank 6: Chief Counselor',
      'Rank 7: State Attorney',
      'Rank 8: Minister of State',
      'Rank 9: Deputy Governor (3 DEPs Only)',
      'Rank 10: Governor (Leader)'
    ]),
    commands: [
      { id: 'gov-1', command: '/govmenu', description: 'Open full Government administrative dashboard and ministerial controls.', syntax: '/govmenu', minRank: 'Rank 1+ (Trainee)', category: 'core' },
      { id: 'gov-2', command: '/d [text]', description: 'Send message over inter-departmental state radio frequency.', syntax: '/d [Department Tag] [Message]', minRank: 'Rank 4+ (Inspector)', category: 'tactical' },
      { id: 'gov-3', command: '/election', description: 'View active gubernatorial election details, voter statistics, and participating candidates.', syntax: '/election', minRank: 'All citizens & staff', category: 'core' },
      { id: 'gov-4', command: '/govvote [candidate]', description: 'Cast official electronic vote for an approved registered candidate.', syntax: '/govvote [Candidate Name / ID]', minRank: 'All citizens', category: 'core' },
      { id: 'gov-5', command: '/candidate [manifesto]', description: 'Submit candidate application with political manifesto to the electoral commission.', syntax: '/candidate [Political Manifesto Text]', minRank: 'Rank 8+ (Minister)', category: 'administration' },
      { id: 'gov-6', command: '/openapplications [hours]', description: 'Open public candidate application window for ministerial or civic candidacies.', syntax: '/openapplications [Duration in Hours]', minRank: 'Leader / Deputy (Rank 9-10)', category: 'administration' },
      { id: 'gov-7', command: '/candidateapprove [id]', description: 'Approve candidate application for election ballot.', syntax: '/candidateapprove [Applicant ID]', minRank: 'Leader / Deputy (Rank 9-10)', category: 'administration' },
      { id: 'gov-8', command: '/candidatereject [id]', description: 'Reject candidate application with stated reason.', syntax: '/candidatereject [Applicant ID] [Reason]', minRank: 'Leader / Deputy (Rank 9-10)', category: 'administration' },
      { id: 'gov-9', command: '/govresults', description: 'Display live certified voting tallies and poll results.', syntax: '/govresults', minRank: 'All staff', category: 'core' },
      { id: 'gov-10', command: '/govelection start [hours]', description: 'Officially open voting booths across all voting centers.', syntax: '/govelection start [Duration in Hours]', minRank: 'Governor (Rank 10)', category: 'administration' },
      { id: 'gov-11', command: '/govelection end', description: 'Close polls, finalize tally, and announce victorious administration.', syntax: '/govelection end', minRank: 'Governor (Rank 10)', category: 'administration' },
      { id: 'gov-12', command: '/govlaws [text]', description: 'Publish and broadcast an official state decree or legislative notice.', syntax: '/govlaws [Decree Title & Content]', minRank: 'Leader / Deputy (Rank 9-10)', category: 'broadcast' },
      { id: 'gov-13', command: '/govtreasury', description: 'Open state treasury ledger and financial reserves overview.', syntax: '/govtreasury', minRank: 'Rank 8+ (Minister)', category: 'economy' },
      { id: 'gov-14', command: '/govdeposit [amount]', description: 'Deposit currency directly into state treasury reserve fund.', syntax: '/govdeposit [Amount in Roubles]', minRank: 'Rank 7+', category: 'economy' },
      { id: 'gov-15', command: '/govwithdraw [amount]', description: 'Withdraw authorized budget allocation for faction subsidies or public works.', syntax: '/govwithdraw [Amount in Roubles]', minRank: 'Governor (Rank 10)', category: 'economy' },
      { id: 'gov-16', command: '/govtax [0-30]', description: 'Adjust province-wide commercial and property tax tariff percentage.', syntax: '/govtax [Rate 0 - 30]', minRank: 'Governor (Rank 10)', category: 'economy' },
      { id: 'gov-17', command: '/wave [your id] [location and requirements]', description: 'Broadcast high-priority interview and recruitment announcement.', syntax: '/wave [Your ID] [Requirements]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'broadcast' },
      { id: 'gov-18', command: '/invite [player] [rank]', description: 'Officially induct and swear in an interviewed citizen into the faction.', syntax: '/invite [Player ID] [Rank 1-3]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'administration' },
      { id: 'gov-19', command: '/uninvite [player]', description: 'Discharge or remove employee from civil service.', syntax: '/uninvite [Player ID] [Reason]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'administration' },
      { id: 'gov-20', command: '/rang [player] [rank]', description: 'Promote or adjust staff hierarchy rank level (1-10).', syntax: '/rang [Player ID] [Rank Level 1-10]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'administration' },
      { id: 'gov-21', command: '/showall', description: 'Inspect complete government civil service roster and online status.', syntax: '/showall', minRank: 'Rank 5+', category: 'core' },
      { id: 'gov-22', command: '/givelic', description: 'Issue official state weapon, transport, or commercial license to applicant.', syntax: '/givelic [Player ID] [License Category]', minRank: 'Rank 5+ (Licensing)', category: 'core' },
      { id: 'gov-23', command: '/free', description: 'Execute licensed public defender legal release or parole bail service.', syntax: '/free [Player ID] [Bail Amount]', minRank: 'Rank 7+ (State Attorney)', category: 'core' }
    ],
    dressCode: {
      rules: [
        'Civil servants must wear formal tier business attire during office duty hours.',
        'Name badge and state lapel pin must remain clearly affixed at chest level.',
        'Footwear must consist of polished dark oxfords or executive closed-toe heels.',
        'Deputy Governors and Governor wear bespoke diplomatic navy suits.'
      ],
      prohibitedItems: [
        'Sportswear, tracksuits, sneakers, casual jeans',
        'Clown masks, animal heads, neon backpacks, festive accessories',
        'Tactical balaclavas or combat helmets inside administrative offices'
      ],
      maleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Trainee / Security Escort', skinId: 'Skin ID #141 / #164', gender: 'male', description: 'Pressed light-grey suit, dark tie, polished dress shoes, and ID badge.', requiredGear: ['ID Badge', 'Notepad', 'Security Radio'] },
        { rankRange: 'Ranks 4–7', title: 'State Inspector / License Specialist / Attorney', skinId: 'Skin ID #187 / #227', gender: 'male', description: 'Tailored charcoal pinstripe suit, burgundy tie, leather briefcase.', requiredGear: ['Attorney Portfolio', 'State Stamp', 'Smartphone'] },
        { rankRange: 'Rank 8–9', title: 'Minister / Deputy Governor (3 DEPs)', skinId: 'Skin ID #228', gender: 'male', description: 'Bespoke deep navy executive suit, gold lapel pin, cufflinks.', requiredGear: ['State Seal Ring', 'Ministerial Portfolio', 'Secure Radio'] },
        { rankRange: 'Rank 10', title: 'Governor (Leader)', skinId: 'Skin ID #295', gender: 'male', description: 'Midnight-blue bespoke ceremonial suit with golden medallion collar.', requiredGear: ['Chain of Office', 'Treasury Keycard', 'Direct Red Line Radio'] }
      ],
      femaleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Junior Clerk / Registrar', skinId: 'Skin ID #148', gender: 'female', description: 'Tailored navy blazer, ivory collared blouse, pressed pencil skirt, low heels.', requiredGear: ['ID Lanyard', 'Official Tablet', 'Pen'] },
        { rankRange: 'Ranks 4–7', title: 'Senior Licensing Officer / Advocate', skinId: 'Skin ID #150', gender: 'female', description: 'Charcoal tailored business suit, white silk blouse, leather portfolio.', requiredGear: ['Dossier Portfolio', 'Legal Stamp', 'Department Radio'] },
        { rankRange: 'Rank 8–9', title: 'Minister / Deputy Governor (3 DEPs)', skinId: 'Skin ID #216', gender: 'female', description: 'Crimson or dark sapphire executive pant-suit, pearl lapel pin, designer tote.', requiredGear: ['Ministerial Badge', 'Encrypted Communicator', 'Cabinet Dossier'] },
        { rankRange: 'Rank 10', title: 'Governor (Leader)', skinId: 'Skin ID #192', gender: 'female', description: 'Bespoke obsidian diplomatic pantsuit with golden embroidered lapels.', requiredGear: ['Ceremonial Insignia', 'Treasury Authorization Seal', 'Executive Comms'] }
      ]
    },
    members: [
      { id: 'gm-1', name: 'Eleano_Siling', rankTitle: 'Governor (Rank 10 - Leader)', rankLevel: 10, dutyHoursThisWeek: 42, completedTasks: 68, infractions: 0, status: 'on_duty', commendations: 8 },
      { id: 'gm-2', name: 'Elena_Voronova', rankTitle: 'Deputy Governor (Rank 9 - DEP 1)', rankLevel: 9, dutyHoursThisWeek: 38, completedTasks: 92, infractions: 0, status: 'on_duty', commendations: 6, isDeputySlot: true },
      { id: 'gm-3', name: 'Mikhail_Gromov', rankTitle: 'Deputy Governor (Rank 9 - DEP 2)', rankLevel: 9, dutyHoursThisWeek: 34, completedTasks: 55, infractions: 0, status: 'off_duty', commendations: 4, isDeputySlot: true },
      { id: 'gm-4', name: 'Sergey_Ignatov', rankTitle: 'Deputy Governor (Rank 9 - DEP 3)', rankLevel: 9, dutyHoursThisWeek: 31, completedTasks: 49, infractions: 0, status: 'active', commendations: 3, isDeputySlot: true },
      { id: 'gm-5', name: 'Stanislav_Zhukov', rankTitle: 'Minister of State (Rank 8)', rankLevel: 8, dutyHoursThisWeek: 29, completedTasks: 44, infractions: 1, status: 'on_duty', commendations: 2 }
    ]
  },

  // 2. ARZAMAS POLICE DEPARTMENT (APD)
  {
    id: 'apd',
    name: 'Arzamas Police Department (APD)',
    shortName: 'APD',
    sector: 'state',
    category: 'law_enforcement',
    tagline: 'Arzamas District Police Department — Urban Patrol, Traffic & Tactical Response',
    leaderTitle: 'Chief of APD / General of Police (Rank 10)',
    currentLeader: 'Vacant',
    deputies: ['Artem_Kazakov', 'Roman_Vasiliev', 'Denis_Morozov'],
    badgeImage: policeBadge,
    accentColor: '#38bdf8',
    stats: {
      activeMembers: 32,
      onDutyNow: 11,
      weeklyDutyHours: 348,
      budgetBalance: '₽ 26,050,000',
      warehouseStock: '74,000 rounds / 210 vests',
      quotaCompletionPercent: 93,
      weeklyPerformanceGrade: 'A',
      curatorNotes: 'Urban district patrols maintained. APD leader position currently vacant — awaiting curator appointment.',
      warningsCount: 0,
    },
    ranks: createRanks([
      'Rank 1: Police Cadet',
      'Rank 2: Junior Sergeant',
      'Rank 3: Sergeant of Police',
      'Rank 4: Senior Sergeant',
      'Rank 5: Lieutenant of Police',
      'Rank 6: Senior Lieutenant',
      'Rank 7: Captain of Police',
      'Rank 8: Major of Police',
      'Rank 9: Colonel / Deputy Chief (3 DEPs Only)',
      'Rank 10: General of Police / Chief (Leader)'
    ]),
    commands: POLICE_SHARED_COMMANDS,
    dressCode: POLICE_SHARED_DRESS_CODE,
    members: [
      { id: 'apd-m1', name: 'Vacant', rankTitle: 'General of Police (Rank 10 - Leader)', rankLevel: 10, dutyHoursThisWeek: 0, completedTasks: 0, infractions: 0, status: 'off_duty', commendations: 0 },
      { id: 'apd-m2', name: 'Artem_Kazakov', rankTitle: 'Colonel of Police (Rank 9 - DEP 1)', rankLevel: 9, dutyHoursThisWeek: 40, completedTasks: 76, infractions: 0, status: 'on_duty', commendations: 7, isDeputySlot: true },
      { id: 'apd-m3', name: 'Roman_Vasiliev', rankTitle: 'Colonel of Police (Rank 9 - DEP 2)', rankLevel: 9, dutyHoursThisWeek: 37, completedTasks: 69, infractions: 0, status: 'on_duty', commendations: 5, isDeputySlot: true },
      { id: 'apd-m4', name: 'Denis_Morozov', rankTitle: 'Colonel of Police (Rank 9 - DEP 3)', rankLevel: 9, dutyHoursThisWeek: 34, completedTasks: 61, infractions: 0, status: 'off_duty', commendations: 4, isDeputySlot: true }
    ]
  },

  // 3. YUZHNY POLICE DEPARTMENT (YPD)
  {
    id: 'ypd',
    name: 'Yuzhny Police Department (YPD)',
    shortName: 'YPD',
    sector: 'state',
    category: 'law_enforcement',
    tagline: 'Yuzhny District Police Department — Port, Highway & Metropolitan Enforcement',
    leaderTitle: 'Chief of YPD / General of Police (Rank 10)',
    currentLeader: 'Mpho_Blackwood',
    deputies: ['Oleg_Kozlov', 'Kirill_Tikhonov', 'Sergey_Bely'],
    badgeImage: policeBadge,
    accentColor: '#3b82f6',
    stats: {
      activeMembers: 34,
      onDutyNow: 12,
      weeklyDutyHours: 366,
      budgetBalance: '₽ 28,100,000',
      warehouseStock: '78,000 rounds / 225 vests',
      quotaCompletionPercent: 95,
      weeklyPerformanceGrade: 'A+',
      curatorNotes: 'Active coastal & highway patrols logged. Leader Mpho_Blackwood in office.',
      warningsCount: 0,
    },
    ranks: createRanks([
      'Rank 1: Police Cadet',
      'Rank 2: Junior Sergeant',
      'Rank 3: Sergeant of Police',
      'Rank 4: Senior Sergeant',
      'Rank 5: Lieutenant of Police',
      'Rank 6: Senior Lieutenant',
      'Rank 7: Captain of Police',
      'Rank 8: Major of Police',
      'Rank 9: Colonel / Deputy Chief (3 DEPs Only)',
      'Rank 10: General of Police / Chief (Leader)'
    ]),
    commands: POLICE_SHARED_COMMANDS,
    dressCode: POLICE_SHARED_DRESS_CODE,
    members: [
      { id: 'ypd-m1', name: 'Mpho_Blackwood', rankTitle: 'General of Police (Rank 10 - Leader)', rankLevel: 10, dutyHoursThisWeek: 45, completedTasks: 84, infractions: 0, status: 'on_duty', commendations: 9 },
      { id: 'ypd-m2', name: 'Oleg_Kozlov', rankTitle: 'Colonel of Police (Rank 9 - DEP 1)', rankLevel: 9, dutyHoursThisWeek: 39, completedTasks: 72, infractions: 0, status: 'on_duty', commendations: 6, isDeputySlot: true },
      { id: 'ypd-m3', name: 'Kirill_Tikhonov', rankTitle: 'Colonel of Police (Rank 9 - DEP 2)', rankLevel: 9, dutyHoursThisWeek: 36, completedTasks: 67, infractions: 0, status: 'on_duty', commendations: 5, isDeputySlot: true },
      { id: 'ypd-m4', name: 'Sergey_Bely', rankTitle: 'Colonel of Police (Rank 9 - DEP 3)', rankLevel: 9, dutyHoursThisWeek: 33, completedTasks: 59, infractions: 0, status: 'off_duty', commendations: 4, isDeputySlot: true }
    ]
  },

  // 3. FSB
  {
    id: 'fsb',
    name: 'FSB (Federal Security Service)',
    shortName: 'FSB',
    sector: 'state',
    category: 'law_enforcement',
    tagline: 'Elite Counter-Intelligence, Constitutional Security & Anti-Terrorism',
    leaderTitle: 'Director of Federal Security Service (Rank 10)',
    currentLeader: 'Vacant',
    deputies: ['Maxim_Tarasov', 'Ilya_Gromov', 'Nikolay_Volkov'],
    badgeImage: policeBadge,
    accentColor: '#6366f1',
    stats: {
      activeMembers: 28,
      onDutyNow: 9,
      weeklyDutyHours: 388,
      budgetBalance: '₽ 78,000,000',
      warehouseStock: 'High-grade spec-ops armament',
      quotaCompletionPercent: 98,
      weeklyPerformanceGrade: 'A+',
      curatorNotes: 'Counter-intelligence operations active. Classified anti-terror raids logged.',
      warningsCount: 0,
    },
    ranks: createRanks([
      'Rank 1: Trainee Agent',
      'Rank 2: Junior Operative',
      'Rank 3: Operative Agent',
      'Rank 4: Senior Operative',
      'Rank 5: Special Agent',
      'Rank 6: Senior Inspector',
      'Rank 7: Alpha Group Commander',
      'Rank 8: Head of Directorate',
      'Rank 9: Deputy Director of FSB (3 DEPs Only)',
      'Rank 10: Director of FSB (Leader)'
    ]),
    commands: [
      { id: 'fsb-1', command: '/pdmenu', description: 'Federal security tactical intelligence console.', syntax: '/pdmenu', minRank: 'Rank 1+ (Agent)', category: 'core' },
      { id: 'fsb-2', command: '/pduty', description: 'Clock into covert or federal counter-terror operational duty.', syntax: '/pduty', minRank: 'Rank 1+ (Agent)', category: 'duty' },
      { id: 'fsb-3', command: '/d [text]', description: 'Encrypted multi-agency emergency department radio.', syntax: '/d [FSB to All] [Directive]', minRank: 'Rank 3+', category: 'tactical' },
      { id: 'fsb-4', command: '/su [id] [stars] [reason]', description: 'Issue federal terrorism or espionage wanted status.', syntax: '/su [Player ID] [Stars] [Reason]', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'fsb-5', command: '/wanted', description: 'Examine national classified wanted registry.', syntax: '/wanted', minRank: 'Rank 1+', category: 'core' },
      { id: 'fsb-6', command: '/clear [id] [reason]', description: 'Classified clearance of suspect records for undercover extraction.', syntax: '/clear [Player ID] [Reason]', minRank: 'Rank 7+', category: 'administration' },
      { id: 'fsb-7', command: '/setmark [id]', description: 'Satellite / cellular cell-tower trace on suspect phone location.', syntax: '/setmark [Player ID]', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'fsb-8', command: '/cuff & /uncuff', description: 'Deploy tactical composite zip-ties / steel cuffs.', syntax: '/cuff [ID] | /uncuff [ID]', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'fsb-9', command: '/search [id]', description: 'Forensic contraband search (reveals serial numbers & contraband).', syntax: '/search [Player ID]', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'fsb-10', command: '/putpl [id] [seat]', description: 'Place high-value detainee into armored federal transport.', syntax: '/putpl [Player ID] [Seat]', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'fsb-11', command: '/arrest [id] [time] [fine]', description: 'Remand criminal directly into federal maximum security detention.', syntax: '/arrest [Player ID] [Time] [Fine]', minRank: 'Rank 3+', category: 'tactical' },
      { id: 'fsb-12', command: '/bkpd & /cbkpd', description: 'Deploy federal code-black tactical beacon / cancel signal.', syntax: '/bkpd | /cbkpd', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'fsb-13', command: '/mpd [text]', description: 'Federal armored vehicle acoustic loudspeaker.', syntax: '/mpd [Directive]', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'fsb-14', command: '/takelic [id] [type]', description: 'Federal revocation of license due to national security risk.', syntax: '/takelic [Player ID] [Type]', minRank: 'Rank 5+', category: 'tactical' },
      { id: 'fsb-15', command: '/ticket [id] [amount] [reason]', description: 'Issue statutory non-compliance penalty.', syntax: '/ticket [Player ID] [Amount] [Reason]', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'fsb-16', command: '/tickets /ptickets /delticket', description: 'Federal citation management subsystem.', syntax: '/tickets | /ptickets | /delticket', minRank: 'Rank 2-6', category: 'core' },
      { id: 'fsb-17', command: '/wave [your id] [location and requirements]', description: 'Classified recruitment academy announcements.', syntax: '/wave [Your ID] [Requirements]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'broadcast' }
    ],
    dressCode: {
      rules: [
        'Civilian infiltration attire is strictly authorized only when operating under active written directorate orders.',
        'During public coordination or raids, operatives must wear official FSB tactical vest with agency patch.',
        'Alpha Group operators wear titanium assault helmets and balaclavas during live tactical interventions.'
      ],
      prohibitedItems: ['Non-regulation colorful sneakers or neon gear', 'Novelty masks, unapproved items'],
      maleUniforms: [
        { rankRange: 'Ranks 1–4', title: 'Field Agent / Operative', skinId: 'Skin ID #165', gender: 'male', description: 'Black tactical turtleneck, dark cargo trousers, Kevlar carrier with FSB chest patch, combat boots.', requiredGear: ['Federal Credential', 'Concealed Sidearm', 'Encrypted Mic'] },
        { rankRange: 'Ranks 5–8', title: 'Alpha Spec-Ops / Senior Operative', skinId: 'Skin ID #285', gender: 'male', description: 'Titanium assault armor, Altyn combat helmet with visor, full black fire-retardant balaclava.', requiredGear: ['Altyn Helmet', 'Heavy Kevlar', 'Val Assault Rifle'] },
        { rankRange: 'Rank 9–10', title: 'Deputy Director / Director of FSB (3 DEPs & Leader)', skinId: 'Skin ID #295', gender: 'male', description: 'Bespoke charcoal-black executive suit with silver FSB eagle crest, leather case.', requiredGear: ['Federal Pass', 'Executive Cryptophone', 'Kremlin Comms'] }
      ],
      femaleUniforms: [
        { rankRange: 'Ranks 1–4', title: 'Field Agent / Covert Specialist', skinId: 'Skin ID #233', gender: 'female', description: 'Fitted black tactical shirt, dark cargo pants, concealed vest, boots, holster rig.', requiredGear: ['Federal Badge ID', 'Radio Earpiece', 'Glock Sidearm'] },
        { rankRange: 'Ranks 5–8', title: 'Tactical Operative (Alpha Division)', skinId: 'Skin ID #307', gender: 'female', description: 'Black assault loadout, Molle chest rig, Kevlar helmet with NV mount, balaclava.', requiredGear: ['Assault Vest Plate', 'Headset', 'Combat SMG'] },
        { rankRange: 'Rank 9–10', title: 'Deputy Director / Director (3 DEPs & Leader)', skinId: 'Skin ID #216', gender: 'female', description: 'Tailored black executive trouser suit with silver federal insignia, leather shoes.', requiredGear: ['Directorate Pass', 'Satellite Device', 'Authoritative Seal'] }
      ]
    },
    members: [
      { id: 'fsb-m1', name: 'Vacant', rankTitle: 'Director of FSB (Rank 10 - Leader)', rankLevel: 10, dutyHoursThisWeek: 0, completedTasks: 0, infractions: 0, status: 'off_duty', commendations: 0 },
      { id: 'fsb-m2', name: 'Maxim_Tarasov', rankTitle: 'Deputy Director of FSB (Rank 9 - DEP 1)', rankLevel: 9, dutyHoursThisWeek: 42, completedTasks: 88, infractions: 0, status: 'on_duty', commendations: 7, isDeputySlot: true },
      { id: 'fsb-m3', name: 'Ilya_Gromov', rankTitle: 'Deputy Director of FSB (Rank 9 - DEP 2)', rankLevel: 9, dutyHoursThisWeek: 38, completedTasks: 75, infractions: 0, status: 'on_duty', commendations: 6, isDeputySlot: true },
      { id: 'fsb-m4', name: 'Nikolay_Volkov', rankTitle: 'Deputy Director of FSB (Rank 9 - DEP 3)', rankLevel: 9, dutyHoursThisWeek: 35, completedTasks: 71, infractions: 0, status: 'off_duty', commendations: 5, isDeputySlot: true }
    ]
  },

  // 4. MILITARY UNIT (ARMY)
  {
    id: 'military',
    name: 'Military Unit ( Army )',
    shortName: 'Military Unit (Army)',
    sector: 'state',
    category: 'military',
    tagline: 'Territorial Defense, Perimeter Garrison & State Ammunition Supply Convoys',
    leaderTitle: 'General of the Army (Rank 10)',
    currentLeader: 'Vacant',
    deputies: ['Sergey_Petrov', 'Konstantin_Burov', 'Dmitry_Egorov'],
    badgeImage: armyBadge,
    accentColor: '#84cc16',
    stats: {
      activeMembers: 72,
      onDutyNow: 26,
      weeklyDutyHours: 780,
      budgetBalance: '₽ 63,400,000',
      warehouseStock: '280,000 / 300,000 materials',
      quotaCompletionPercent: 97,
      weeklyPerformanceGrade: 'A+',
      curatorNotes: 'Ammo convoys delivered to state departments without losses. Base checkpoints fortified.',
      warningsCount: 0,
    },
    ranks: createRanks([
      'Rank 1: Private (Ryadovoy)',
      'Rank 2: Corporal (Efreitor)',
      'Rank 3: Junior Sergeant',
      'Rank 4: Sergeant',
      'Rank 5: Senior Sergeant',
      'Rank 6: Starshina (Warrant Officer)',
      'Rank 7: Lieutenant',
      'Rank 8: Captain / Major',
      'Rank 9: Colonel / Deputy Commander (3 DEPs Only)',
      'Rank 10: General of the Army (Leader)'
    ]),
    commands: [
      { id: 'army-1', command: '/army', description: 'To see army menu (ammo stockpiles, guard posts, convoy status).', syntax: '/army', minRank: 'Rank 1+ (Private)', category: 'core' },
      { id: 'army-2', command: '/armyinvite', description: 'Recruit recruit into military defense brigade.', syntax: '/armyinvite [Player ID]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'administration' },
      { id: 'army-3', command: '/armykick', description: 'Discharge soldier from military service.', syntax: '/armykick [Player ID] [Reason]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'administration' },
      { id: 'army-4', command: '/armyrank', description: 'Promote or adjust military rank tier (1-10).', syntax: '/armyrank [Player ID] [Rank Level 1-10]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'administration' },
      { id: 'army-5', command: '/armyinfo', description: 'Check garrison ammunition inventory and warehouse logistics.', syntax: '/armyinfo', minRank: 'Rank 1+ (Private)', category: 'core' },
      { id: 'army-6', command: '/armyranks', description: 'View military rank hierarchy table and criteria.', syntax: '/armyranks', minRank: 'All soldiers', category: 'core' },
      { id: 'army-7', command: '/armylist', description: 'View roster of soldiers stationed at the base.', syntax: '/armylist', minRank: 'Rank 1+', category: 'core' },
      { id: 'army-8', command: '/armywarehouse', description: 'See warehouse and material stock.', syntax: '/armywarehouse', minRank: 'Rank 1+', category: 'core' },
      { id: 'army-9', command: '/armyduty', description: 'Equip combat fatigue uniform, rifle, Kevlar, and go on duty.', syntax: '/armyduty', minRank: 'Rank 1+ (Private)', category: 'duty' },
      { id: 'army-10', command: '/armypatrol', description: 'Start border / base perimeter patrol.', syntax: '/armypatrol', minRank: 'Rank 2+ (Corporal)', category: 'tactical' },
      { id: 'army-11', command: '/armyguard', description: 'Assume guard post on tower or checkpoint gate.', syntax: '/armyguard [Post Name]', minRank: 'Rank 1+ (Private)', category: 'tactical' },
      { id: 'army-12', command: '/armyguardoff', description: 'Relieve sentry guard post.', syntax: '/armyguardoff', minRank: 'Rank 1+', category: 'tactical' },
      { id: 'army-13', command: '/armysalute', description: 'Execute military honor salute.', syntax: '/armysalute', minRank: 'All soldiers', category: 'tactical' },
      { id: 'army-14', command: '/armygetammo', description: 'Load manufactured ammunition crates onto transport truck.', syntax: '/armygetammo', minRank: 'Rank 2+ (Corporal)', category: 'tactical' },
      { id: 'army-15', command: '/armyputammo', description: 'Deliver ammunition to destination state warehouse.', syntax: '/armyputammo', minRank: 'Rank 2+ (Corporal)', category: 'tactical' },
      { id: 'army-16', command: '/takem', description: 'Take materials from warehouse.', syntax: '/takem [Quantity]', minRank: 'Rank 3+', category: 'economy' },
      { id: 'army-17', command: '/putm', description: 'Store materials into warehouse.', syntax: '/putm [Quantity]', minRank: 'Rank 1+', category: 'economy' },
      { id: 'army-18', command: '/wave [your id] [location and requirements]', description: 'Interview announcement broadcast for military enlistment.', syntax: '/wave [Your ID] [Location & Requirements]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'broadcast' }
    ],
    dressCode: {
      rules: [
        'Soldiers on duty or convoys must wear digital flora camo with ballistic helmet.',
        'Leaving military grounds in uniform without an official convoy order is treated as desertion.',
        'Officers (Rank 7+) wear olive service tunics during command assemblies.'
      ],
      prohibitedItems: ['Civilian sportswear, sneakers, colorful caps', 'Party masks, novelty items, cartoon hats'],
      maleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Private / Corporal (Enlisted)', skinId: 'Skin ID #287', gender: 'male', description: 'VKPO digital flora camouflage fatigue, 6B47 ballistic helmet, Ratnik combat vest, combat boots.', requiredGear: ['Ratnik Vest', 'AK-74M Rifle', 'Sentry Radio'] },
        { rankRange: 'Ranks 4–7', title: 'Sergeant / Lieutenant (Platoon Leader)', skinId: 'Skin ID #255', gender: 'male', description: 'Tactical combat fatigues, modular plate carrier, field radio backpack, tactical gloves.', requiredGear: ['Plate Carrier', 'AK-74M & Pistol', 'Tactical Headset'] },
        { rankRange: 'Rank 8', title: 'Major / Battalion Commander', skinId: 'Skin ID #285', gender: 'male', description: 'Olive drab officer service uniform with golden epaulettes, service ribbons, peaked cap.', requiredGear: ['Officer Cap', 'Makarov Pistol', 'Battalion Radio'] },
        { rankRange: 'Rank 9–10', title: 'Colonel / General of the Army (3 DEPs & Leader)', skinId: 'Skin ID #288', gender: 'male', description: 'Ceremonial General greatcoat with red piping, karakul collar/hat, gold marshal stars.', requiredGear: ['Marshal Epaulettes', 'Ceremonial Sidearm', 'Command Comms'] }
      ],
      femaleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Private / Corporal (Comms & Medic)', skinId: 'Skin ID #191', gender: 'female', description: 'Digital flora camouflage combat fatigues, fitted Ratnik vest, field cap or helmet.', requiredGear: ['Ballistic Vest', 'AK-74M Carbine', 'Field Medical Kit'] },
        { rankRange: 'Ranks 4–7', title: 'Sergeant / Lieutenant (Convoy Commander)', skinId: 'Skin ID #307', gender: 'female', description: 'Reinforced field camouflage uniform, modular Molle rig, tactical knee pads, holster.', requiredGear: ['Convoy Rig', 'Sidearm & Carbine', 'Encrypted Comms'] },
        { rankRange: 'Rank 8', title: 'Major / Staff Officer', skinId: 'Skin ID #219', gender: 'female', description: 'Olive drab tailored officer tunic with gold epaulettes, officer skirt/slacks, parade cap.', requiredGear: ['Staff Crest', 'Officer Sidearm', 'Command Tablet'] },
        { rankRange: 'Rank 9–10', title: 'Colonel / High Command Deputy (3 DEPs & Leader)', skinId: 'Skin ID #150', gender: 'female', description: 'Tailored deep olive ceremonial service dress uniform with gold braids, red lapels.', requiredGear: ['Medallion Insignia', 'Executive Sidearm', 'Strategic Radio'] }
      ]
    },
    members: [
      { id: 'arm-1', name: 'Vacant', rankTitle: 'General of the Army (Rank 10 - Leader)', rankLevel: 10, dutyHoursThisWeek: 0, completedTasks: 0, infractions: 0, status: 'off_duty', commendations: 0 },
      { id: 'arm-2', name: 'Sergey_Petrov', rankTitle: 'Colonel / Deputy (Rank 9 - DEP 1)', rankLevel: 9, dutyHoursThisWeek: 41, completedTasks: 78, infractions: 0, status: 'on_duty', commendations: 6, isDeputySlot: true },
      { id: 'arm-3', name: 'Konstantin_Burov', rankTitle: 'Colonel / Deputy (Rank 9 - DEP 2)', rankLevel: 9, dutyHoursThisWeek: 37, completedTasks: 70, infractions: 0, status: 'on_duty', commendations: 5, isDeputySlot: true },
      { id: 'arm-4', name: 'Dmitry_Egorov', rankTitle: 'Colonel / Deputy (Rank 9 - DEP 3)', rankLevel: 9, dutyHoursThisWeek: 33, completedTasks: 65, infractions: 0, status: 'off_duty', commendations: 4, isDeputySlot: true }
    ]
  },

  // 5. NEWS NETWORK (NN / MEDIA)
  {
    id: 'news_network',
    name: 'News Network (NN/MEDIA)',
    shortName: 'News Network (NN/MEDIA)',
    sector: 'state',
    category: 'media',
    tagline: 'Television, Radio Broadcasting, Public Advertisements & Investigative Journalism',
    leaderTitle: 'Director of Media Network (Rank 10)',
    currentLeader: 'Vacant',
    deputies: ['Daniil_Kozlov', 'Pavel_Sorokin', 'Artem_Lebedev'],
    badgeImage: policeBadge,
    accentColor: '#f59e0b',
    stats: {
      activeMembers: 45,
      onDutyNow: 16,
      weeklyDutyHours: 540,
      budgetBalance: '₽ 46,800,000',
      warehouseStock: 'High-end TV & OB Van cameras',
      quotaCompletionPercent: 95,
      weeklyPerformanceGrade: 'A',
      curatorNotes: 'Advertisement queue cleared rapidly under PRO grammar guidelines. Radio interviews hosted.',
      warningsCount: 0,
    },
    ranks: createRanks([
      'Rank 1: Intern (Trainee)',
      'Rank 2: Sound Technician / Cameraman',
      'Rank 3: Junior Journalist',
      'Rank 4: Correspondent',
      'Rank 5: Radio Presenter / Host',
      'Rank 6: Senior Editor',
      'Rank 7: Special Investigative Reporter',
      'Rank 8: Chief Editor / Producer',
      'Rank 9: Deputy Director of Media (3 DEPs Only)',
      'Rank 10: Director of Media Network (Leader)'
    ]),
    commands: [
      { id: 'nn-1', command: '/nmenu', description: 'Open media newsroom menu.', syntax: '/nmenu', minRank: 'Rank 1+ (Intern)', category: 'core' },
      { id: 'nn-2', command: '/nwarehouse', description: 'See warehouse supplies.', syntax: '/nwarehouse', minRank: 'Rank 1+', category: 'core' },
      { id: 'nn-3', command: '/ntake', description: 'Take equipment (camera, microphone, tripod) from warehouse.', syntax: '/ntake', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'nn-4', command: '/nreturn', description: 'Return equipment back to warehouse.', syntax: '/nreturn', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'nn-5', command: '/ndeposit', description: 'Deposit money into faction cash desk.', syntax: '/ndeposit [Amount]', minRank: 'Rank 1+', category: 'economy' },
      { id: 'nn-6', command: '/nbankdeposit & /nbankwithdraw', description: 'Deposit and withdraw to/from media faction bank account.', syntax: '/nbankdeposit [Amount] | /nbankwithdraw [Amount]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'economy' },
      { id: 'nn-7', command: '/nmic', description: 'Turn on wireless microphone.', syntax: '/nmic', minRank: 'Rank 3+', category: 'broadcast' },
      { id: 'nn-8', command: '/ncamera', description: 'Activate TV broadcast camera.', syntax: '/ncamera', minRank: 'Rank 2+', category: 'broadcast' },
      { id: 'nn-9', command: '/ninterview', description: 'Initiate interview with guest player.', syntax: '/ninterview [Guest ID]', minRank: 'Rank 5+', category: 'broadcast' },
      { id: 'nn-10', command: '/nfuel', description: 'Refuel mobile broadcast van (OB Van).', syntax: '/nfuel', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'nn-11', command: '/npress', description: 'Show official PRESS press-card credential.', syntax: '/npress', minRank: 'Rank 2+', category: 'core' },
      { id: 'nn-12', command: '/news', description: 'Send official news broadcast text to oblast radios.', syntax: '/news [Text]', minRank: 'Rank 6+', category: 'broadcast' },
      { id: 'nn-13', command: '/ncall & /ncalls', description: 'Call hotline / See list of incoming caller requests.', syntax: '/ncall | /ncalls', minRank: 'Rank 4+', category: 'broadcast' },
      { id: 'nn-14', command: '/naccept & /nendcall', description: 'Accept calls / End call with live radio caller.', syntax: '/naccept [ID] | /nendcall [ID]', minRank: 'Rank 4+', category: 'broadcast' },
      { id: 'nn-15', command: '/nlive & /nendlive', description: 'Start live on-air stream / End live stream.', syntax: '/nlive | /nendlive', minRank: 'Rank 5+', category: 'broadcast' },
      { id: 'nn-16', command: '/nt', description: 'Send studio text to live broadcast.', syntax: '/nt [Text]', minRank: 'Rank 4+', category: 'broadcast' },
      { id: 'nn-17', command: '/nlisten', description: 'Listen to radio frequency monitor.', syntax: '/nlisten', minRank: 'Rank 1+', category: 'broadcast' },
      { id: 'nn-18', command: '/npass', description: 'Check press pass of employee.', syntax: '/npass [ID]', minRank: 'Rank 3+', category: 'core' },
      { id: 'nn-19', command: '/nreport & /nreports', description: 'Submit daily report / View list of reports submitted.', syntax: '/nreport | /nreports', minRank: 'Rank 3+', category: 'administration' },
      { id: 'nn-20', command: '/nstats', description: 'See media employee statistics (ads edited, streams).', syntax: '/nstats', minRank: 'Rank 1+', category: 'core' },
      { id: 'nn-21', command: '/nvehicles', description: 'Media fleet management.', syntax: '/nvehicles', minRank: 'Rank 5+', category: 'tactical' },
      { id: 'nn-22', command: '/nhelp', description: 'Quick help for media commands.', syntax: '/nhelp', minRank: 'Rank 1+', category: 'core' },
      { id: 'nn-23', command: '/ad', description: 'Submit announcement to radio queue.', syntax: '/ad [Text]', minRank: 'All citizens', category: 'core' },
      { id: 'nn-24', command: '/edit', description: 'To edit announcement from player (PRO rules).', syntax: '/edit', minRank: 'Rank 2+', category: 'core' },
      { id: 'nn-25', command: '/t & /u', description: 'Fast edit (/t) and approve/publish (/u) advertisement to broadcast.', syntax: '/t [ID] [Text] | /u [ID]', minRank: 'Rank 2+', category: 'core' },
      { id: 'nn-26', command: '/givemic', description: 'Give mic / take mic to the guest who wants to speak in radio.', syntax: '/givemic [Player ID]', minRank: 'Rank 4+', category: 'broadcast' },
      { id: 'nn-27', command: '/wave [your id] [location and requirements]', description: 'Interview announcement broadcast.', syntax: '/wave [Your ID] [Location & Requirements]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'broadcast' }
    ],
    dressCode: {
      rules: [
        'Presenters and journalists must maintain clean, professional broadcast attire.',
        'During field reporting in riot or disaster zones, a blue PRESS vest must be worn.',
        'Lanyards with press cards must remain visible.'
      ],
      prohibitedItems: ['Tracksuits, shorts, gym footwear', 'Facial masks during on-air studio broadcast', 'Carrying unholstered weapons into studio'],
      maleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Intern / Tech / Editor', skinId: 'Skin ID #188', gender: 'male', description: 'Smart casual button-up shirt, dark trousers, studio headset, PRESS pass lanyard.', requiredGear: ['Press Card', 'Studio Headset', 'Ad Tablet'] },
        { rankRange: 'Ranks 4–7', title: 'Journalist / Anchor / Field Reporter', skinId: 'Skin ID #261', gender: 'male', description: 'Tailored cobalt blue blazer, collared shirt, dark slacks, blue PRESS field vest.', requiredGear: ['Wireless Mic', 'PRESS Vest', 'Audio Recorder'] },
        { rankRange: 'Rank 8', title: 'Chief Editor / Executive Producer', skinId: 'Skin ID #171', gender: 'male', description: 'Bespoke slate-grey suit, silk tie, press management portfolio, dress shoes.', requiredGear: ['Executive Pass', 'Studio Keycard', 'Director Comms'] },
        { rankRange: 'Rank 9–10', title: 'Deputy Director / Director (3 DEPs & Leader)', skinId: 'Skin ID #295', gender: 'male', description: 'Designer black formal suit with golden NN lapel pin, bespoke dress shirt, luxury watch.', requiredGear: ['General Director Seal', 'Master Terminal Key', 'Hotline Phone'] }
      ],
      femaleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Intern / Proofreader', skinId: 'Skin ID #148', gender: 'female', description: 'Smart pastel blouse, pleated skirt or dress slacks, press lanyard, low heels.', requiredGear: ['Press Lanyard', 'Headset', 'Ad Tablet'] },
        { rankRange: 'Ranks 4–7', title: 'TV Anchor / Special Correspondent', skinId: 'Skin ID #216', gender: 'female', description: 'Tailored emerald or royal blue blazer, silk camisole, pencil skirt, PRESS vest.', requiredGear: ['TV Mic', 'Field PRESS Vest', 'Communicator'] },
        { rankRange: 'Rank 8', title: 'Senior Producer', skinId: 'Skin ID #150', gender: 'female', description: 'Charcoal tailored pantsuit, silver jewellery, leather media dossier.', requiredGear: ['Executive Pass', 'Producer Headset', 'Programming Tablet'] },
        { rankRange: 'Rank 9–10', title: 'Deputy Director / Director (3 DEPs & Leader)', skinId: 'Skin ID #192', gender: 'female', description: 'Bespoke midnight couture suit with golden embroidered NN emblem, pearl earrings.', requiredGear: ['Director Crest', 'Terminal Master Key', 'Press Hotline'] }
      ]
    },
    members: [
      { id: 'nn-m1', name: 'Vacant', rankTitle: 'Director of Media (Rank 10 - Leader)', rankLevel: 10, dutyHoursThisWeek: 0, completedTasks: 0, infractions: 0, status: 'off_duty', commendations: 0 },
      { id: 'nn-m2', name: 'Daniil_Kozlov', rankTitle: 'Deputy Director of Media (Rank 9 - DEP 1)', rankLevel: 9, dutyHoursThisWeek: 39, completedTasks: 210, infractions: 0, status: 'on_duty', commendations: 7, isDeputySlot: true },
      { id: 'nn-m3', name: 'Pavel_Sorokin', rankTitle: 'Deputy Director of Media (Rank 9 - DEP 2)', rankLevel: 9, dutyHoursThisWeek: 36, completedTasks: 185, infractions: 0, status: 'on_duty', commendations: 6, isDeputySlot: true },
      { id: 'nn-m4', name: 'Artem_Lebedev', rankTitle: 'Deputy Director of Media (Rank 9 - DEP 3)', rankLevel: 9, dutyHoursThisWeek: 33, completedTasks: 160, infractions: 0, status: 'off_duty', commendations: 5, isDeputySlot: true }
    ]
  },

  // 6. HOSPITAL (EMS)
  {
    id: 'hospital',
    name: 'Hospital (Emergency Medical Service / Central City Hospital)',
    shortName: 'Hospital (EMS)',
    sector: 'state',
    category: 'medical',
    tagline: 'Emergency Trauma Response, Medical Licensing & Healthcare Services',
    leaderTitle: 'Chief Physician of Hospital (Rank 10)',
    currentLeader: 'Vacant',
    deputies: ['Tatyana_Semenova', 'Evgeny_Sorokin', 'Olga_Pavlova'],
    badgeImage: medicBadge,
    accentColor: '#10b981',
    stats: {
      activeMembers: 58,
      onDutyNow: 19,
      weeklyDutyHours: 640,
      budgetBalance: '₽ 59,300,000',
      warehouseStock: '240,000 medical kits & pharmaceuticals',
      quotaCompletionPercent: 96,
      weeklyPerformanceGrade: 'A+',
      curatorNotes: 'Dispatches responded promptly. Health cards issued for state recruits continuously.',
      warningsCount: 0,
    },
    ranks: createRanks([
      'Rank 1: Medical Intern',
      'Rank 2: Field Paramedic',
      'Rank 3: Junior Therapist',
      'Rank 4: Physician Therapist',
      'Rank 5: Attending Surgeon',
      'Rank 6: Traumatologist',
      'Rank 7: Specialized Surgeon',
      'Rank 8: Head of Clinical Department',
      'Rank 9: Deputy Chief Physician (3 DEPs Only)',
      'Rank 10: Chief Physician (Leader)'
    ]),
    commands: [
      { id: 'hosp-1', command: '/hshift', description: 'End/Start duty and access medical locker.', syntax: '/hshift', minRank: 'Rank 1+ (Intern)', category: 'duty' },
      { id: 'hosp-2', command: '/hwarehouse', description: 'See warehouse inventory and medical stocks.', syntax: '/hwarehouse', minRank: 'Rank 1+', category: 'core' },
      { id: 'hosp-3', command: '/hkit', description: 'Take medical kit from warehouse.', syntax: '/hkit [Quantity]', minRank: 'Rank 1+', category: 'tactical' },
      { id: 'hosp-4', command: '/hcard', description: 'Issue official medical card to citizen.', syntax: '/hcard [Player ID] [Price/Duration]', minRank: 'Rank 3+', category: 'core' },
      { id: 'hosp-5', command: '/hcall', description: 'Call emergency dispatch.', syntax: '/hcall', minRank: 'Rank 1+', category: 'tactical' },
      { id: 'hosp-6', command: '/hcalls', description: 'See list of emergency calls.', syntax: '/hcalls', minRank: 'Rank 1+', category: 'tactical' },
      { id: 'hosp-7', command: '/haccept', description: 'Accept calls from citizens in distress.', syntax: '/haccept [Call ID]', minRank: 'Rank 2+ (Paramedic)', category: 'tactical' },
      { id: 'hosp-8', command: '/hdowned', description: 'Help a player that is down / injured on ground.', syntax: '/hdowned [Player ID]', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'hosp-9', command: '/revive', description: 'Revive a player that is down using defibrillator.', syntax: '/revive [Player ID]', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'hosp-10', command: '/hfinish', description: 'Finish a call after helping the patient.', syntax: '/hfinish', minRank: 'Rank 2+', category: 'tactical' },
      { id: 'hosp-11', command: '/htreat', description: 'Treat a patient in hospital bed or ambulance.', syntax: '/htreat [Player ID] [Price]', minRank: 'Rank 2+', category: 'core' },
      { id: 'hosp-12', command: '/hpatient', description: 'See patient admission list.', syntax: '/hpatient', minRank: 'Rank 1+', category: 'core' },
      { id: 'hosp-13', command: '/hdeposit', description: 'Deposit money into the faction bank.', syntax: '/hdeposit [Amount]', minRank: 'Rank 1+', category: 'economy' },
      { id: 'hosp-14', command: '/hwithdraw', description: 'Withdraw money from faction bank.', syntax: '/hwithdraw [Amount]', minRank: 'Rank 9-10 (Deputy / Leader)', category: 'economy' },
      { id: 'hosp-15', command: '/medstats', description: 'Check personal and department medical stats.', syntax: '/medstats [Player ID]', minRank: 'Rank 1+', category: 'core' },
      { id: 'hosp-16', command: '/wound', description: 'Heal yourself / administer first aid.', syntax: '/wound', minRank: 'Rank 1+', category: 'tactical' }
    ],
    dressCode: {
      rules: [
        'Medical staff on shift must wear clean scrubs or doctor coat.',
        'Stethoscope and ID badge must be worn around neck / pinned on coat.',
        'No visible weapons are permitted on hospital premises.'
      ],
      prohibitedItems: ['Street slippers, civilian dirty clothes', 'Carnival masks, funny sunglasses', 'Weapons carried openly'],
      maleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Intern / Paramedic', skinId: 'Skin ID #274', gender: 'male', description: 'Teal-blue paramedic scrubs, reflective stripes, trauma holster, non-slip shoes.', requiredGear: ['First Aid Kit', 'Stethoscope', 'Ambulance Radio'] },
        { rankRange: 'Ranks 4–7', title: 'Therapist / Surgeon', skinId: 'Skin ID #275', gender: 'male', description: 'Pristine pressed white physician lab coat over dark navy scrubs, diagnostic penlight.', requiredGear: ['Stethoscope', 'Prescription Pad', 'Penlight'] },
        { rankRange: 'Rank 8', title: 'Head of Clinical Directorate', skinId: 'Skin ID #276', gender: 'male', description: 'Executive long tailored medical coat, gold physician lapel emblem, tie.', requiredGear: ['Chief Badge', 'Hospital Seal', 'Department Tablet'] },
        { rankRange: 'Rank 9–10', title: 'Deputy Chief / Chief Physician (3 DEPs & Leader)', skinId: 'Skin ID #295', gender: 'male', description: 'Formal three-piece dark suit with gold Red Cross medical service medallion.', requiredGear: ['Caduceus Pin', 'Health Seal', 'Emergency Hotline'] }
      ],
      femaleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Intern / Nurse / Paramedic', skinId: 'Skin ID #219', gender: 'female', description: 'Fitted teal medical scrub top and trousers, hospital lanyard, nursing pouch.', requiredGear: ['Trauma Bag', 'Stethoscope', 'Radio'] },
        { rankRange: 'Ranks 4–7', title: 'Physician / Surgeon', skinId: 'Skin ID #308', gender: 'female', description: 'Tailored white doctor coat over light blue scrubs, silver stethoscope, tablet.', requiredGear: ['Medical Tablet', 'Stethoscope', 'Prescription Stamp'] },
        { rankRange: 'Rank 8', title: 'Department Head', skinId: 'Skin ID #148', gender: 'female', description: 'Crisp white doctor coat with golden trim over business attire, gold medical badge.', requiredGear: ['Directorate Lanyard', 'Hospital Seal', 'Radio'] },
        { rankRange: 'Rank 9–10', title: 'Deputy Chief / Chief Physician (3 DEPs & Leader)', skinId: 'Skin ID #192', gender: 'female', description: 'Bespoke dark tailored executive suit with silver-gold Caduceus insignia.', requiredGear: ['Chief Physician Medallion', 'National Health Seal', 'Comms'] }
      ]
    },
    members: [
      { id: 'hosp-m1', name: 'Vacant', rankTitle: 'Chief Physician (Rank 10 - Leader)', rankLevel: 10, dutyHoursThisWeek: 0, completedTasks: 0, infractions: 0, status: 'off_duty', commendations: 0 },
      { id: 'hosp-m2', name: 'Tatyana_Semenova', rankTitle: 'Deputy Chief Physician (Rank 9 - DEP 1)', rankLevel: 9, dutyHoursThisWeek: 40, completedTasks: 165, infractions: 0, status: 'on_duty', commendations: 8, isDeputySlot: true },
      { id: 'hosp-m3', name: 'Evgeny_Sorokin', rankTitle: 'Deputy Chief Physician (Rank 9 - DEP 2)', rankLevel: 9, dutyHoursThisWeek: 37, completedTasks: 140, infractions: 0, status: 'on_duty', commendations: 6, isDeputySlot: true },
      { id: 'hosp-m4', name: 'Olga_Pavlova', rankTitle: 'Deputy Chief Physician (Rank 9 - DEP 3)', rankLevel: 9, dutyHoursThisWeek: 34, completedTasks: 128, infractions: 0, status: 'off_duty', commendations: 5, isDeputySlot: true }
    ]
  },

  // 7. TAMBOV OCG
  {
    id: 'tambov_ocg',
    name: 'Tambov Organized Crime Group (Tambov OCG)',
    shortName: 'Tambov OCG',
    sector: 'ocg',
    category: 'underground',
    tagline: 'Underground Syndicate, Industrial Arms Smuggling, Business Warfare & Protection Rackets',
    leaderTitle: 'Vor v Zakone / Boss of Tambov (Rank 10)',
    currentLeader: 'Alex_Feonel',
    deputies: ['Ruslan_Kozlov', 'Igor_Shishov', 'Dmitry_Burlak'],
    badgeImage: syndicateBadge,
    accentColor: '#e11d48',
    stats: {
      activeMembers: 52,
      onDutyNow: 18,
      weeklyDutyHours: 490,
      budgetBalance: '₽ 87,500,000',
      warehouseStock: '142,000 materials & illegal weapons',
      quotaCompletionPercent: 93,
      weeklyPerformanceGrade: 'A',
      curatorNotes: 'Bizwar participation documented under server rules. Hostage protocols observed.',
      warningsCount: 0,
    },
    ranks: createRanks([
      'Rank 1: Novice (Patsan)',
      'Rank 2: Fighter (Boyets)',
      'Rank 3: Gunsmith (Oruzhnik)',
      'Rank 4: Enforcer (Bik)',
      'Rank 5: Dealer (Baryga)',
      'Rank 6: Collector (Sborshchik)',
      'Rank 7: Captain (Desyatnik)',
      'Rank 8: Brigadier (Sotnik)',
      'Rank 9: Underboss / Deputy (3 DEPs Only)',
      'Rank 10: Vor v Zakone / Boss (Leader)'
    ]),
    commands: OCG_SHARED_COMMANDS,
    dressCode: {
      rules: [
        'Dark stylish syndicate attire projecting authority and respect.',
        'During shootouts or bizwars, black balaclavas are mandatory to prevent recognition.',
        'Boss and Deputies wear bespoke Italian tailored suits or velvet pinstripes.'
      ],
      prohibitedItems: ['Joke clown masks, animal hats', 'Police or military state badges without RP reason'],
      maleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Novice / Fighter', skinId: 'Skin ID #125', gender: 'male', description: 'Dark leather jacket, track pants or black denim, boots, gold chain, concealed brass knuckles.', requiredGear: ['Concealed Handgun', 'Rope for /tie', 'Burner Phone'] },
        { rankRange: 'Ranks 4–7', title: 'Enforcer / Captain', skinId: 'Skin ID #111', gender: 'male', description: 'Black wool trench coat, dark turtleneck, leather gloves, signet ring.', requiredGear: ['Suppressed Pistol', 'Black Balaclava / Bag', 'Encrypted Radio'] },
        { rankRange: 'Rank 8', title: 'Brigadier', skinId: 'Skin ID #127', gender: 'male', description: 'Pinstripe Italian tailored wool suit, silk pocket square, luxury shoes, gold signet.', requiredGear: ['Signet Ring', 'Engraved Deagle', 'Vault Credentials'] },
        { rankRange: 'Rank 9–10', title: 'Underboss / Boss of Tambov (3 DEPs & Leader)', skinId: 'Skin ID #124', gender: 'male', description: 'Bespoke obsidian double-breasted suit, platinum watch, custom embroidered family crest.', requiredGear: ['Thief-in-Law Star Insignia', 'Vault Master Key', 'Black Market Comms'] }
      ],
      femaleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Novice / Courier', skinId: 'Skin ID #226', gender: 'female', description: 'Black fitted leather jacket, dark cargo pants, combat boots, fingerless gloves, concealed holster.', requiredGear: ['Concealed Handgun', 'Rope for /tie', 'Covert Radio'] },
        { rankRange: 'Ranks 4–7', title: 'Enforcer / Captain', skinId: 'Skin ID #193', gender: 'female', description: 'Noir leather trench coat, fitted turtleneck, dark sunglasses, leather gloves, combat knife.', requiredGear: ['Compact SMG', 'Black Mask', 'Encrypted Radio'] },
        { rankRange: 'Rank 8', title: 'Brigadier', skinId: 'Skin ID #214', gender: 'female', description: 'Luxury dark velvet dress or tailored designer suit, faux fur stole, diamond jewelry.', requiredGear: ['Syndicate Ring', 'Engraved Sidearm', 'Cartel Ledger'] },
        { rankRange: 'Rank 9–10', title: 'Underboss / Matriarch (3 DEPs & Leader)', skinId: 'Skin ID #192', gender: 'female', description: 'Bespoke couture noir pant-suit with gold dragon embroidery, platinum jewellery, cloak.', requiredGear: ['Syndicate Seal Ring', 'Master Keycard', 'Underground Hub Comms'] }
      ]
    },
    members: [
      { id: 'tb-m1', name: 'Alex_Feonel', rankTitle: 'Vor v Zakone (Rank 10 - Leader)', rankLevel: 10, dutyHoursThisWeek: 42, completedTasks: 70, infractions: 0, status: 'on_duty', commendations: 7 },
      { id: 'tb-m2', name: 'Ruslan_Kozlov', rankTitle: 'Underboss / Deputy (Rank 9 - DEP 1)', rankLevel: 9, dutyHoursThisWeek: 37, completedTasks: 65, infractions: 0, status: 'on_duty', commendations: 5, isDeputySlot: true },
      { id: 'tb-m3', name: 'Igor_Shishov', rankTitle: 'Underboss / Deputy (Rank 9 - DEP 2)', rankLevel: 9, dutyHoursThisWeek: 34, completedTasks: 58, infractions: 0, status: 'on_duty', commendations: 4, isDeputySlot: true },
      { id: 'tb-m4', name: 'Dmitry_Burlak', rankTitle: 'Underboss / Deputy (Rank 9 - DEP 3)', rankLevel: 9, dutyHoursThisWeek: 31, completedTasks: 52, infractions: 0, status: 'off_duty', commendations: 4, isDeputySlot: true }
    ]
  },

  // 8. CAUCASIAN OCG
  {
    id: 'caucasian_ocg',
    name: 'Caucasian Organized Crime Group (Caucasian OCG)',
    shortName: 'Caucasian OCG',
    sector: 'ocg',
    category: 'underground',
    tagline: 'Highland Syndicate, Cross-Border Weapon Trade, Nightclub Control & Turf Warfare',
    leaderTitle: 'Vor v Zakone / Supreme Authority (Rank 10)',
    currentLeader: 'Sam_Alexander',
    deputies: ['Magomed_Aliev', 'Murad_Isaev', 'Zelimkhan_Basaev'],
    badgeImage: syndicateBadge,
    accentColor: '#f43f5e',
    stats: {
      activeMembers: 48,
      onDutyNow: 16,
      weeklyDutyHours: 460,
      budgetBalance: '₽ 79,200,000',
      warehouseStock: '135,000 materials & firearms',
      quotaCompletionPercent: 91,
      weeklyPerformanceGrade: 'A',
      curatorNotes: 'Nightclub & auto shop bizwars carried out cleanly. Quota fulfilled.',
      warningsCount: 0,
    },
    ranks: createRanks([
      'Rank 1: Novice (Dzhigit)',
      'Rank 2: Scout (Razvedchik)',
      'Rank 3: Shooter (Strelok)',
      'Rank 4: Guard (Okhrannik)',
      'Rank 5: Arms Carrier (Oruzheynik)',
      'Rank 6: Field Lieutenant (Sotnik)',
      'Rank 7: Senior Authority (Avtoritet)',
      'Rank 8: Clan Brigadier',
      'Rank 9: Deputy Authority (3 DEPs Only)',
      'Rank 10: Supreme Leader / Vor (Leader)'
    ]),
    commands: OCG_SHARED_COMMANDS,
    dressCode: {
      rules: [
        'Dark stylish leather jackets, executive black coats, or tailored charcoal suits.',
        'Balaclavas required during all turf wars and kidnapping scenarios.',
        'High-ranking deputies wear luxury dark shirts and signet rings.'
      ],
      prohibitedItems: ['Bright neon party masks, festive accessories', 'Non-RP outfits'],
      maleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Novice / Shooter', skinId: 'Skin ID #125', gender: 'male', description: 'Fitted black leather jacket, dark jeans, tactical boots, gold chain, concealed holster.', requiredGear: ['Handgun', 'Rope for /tie', 'Mobile Device'] },
        { rankRange: 'Ranks 4–7', title: 'Guard / Authority', skinId: 'Skin ID #111', gender: 'male', description: 'Long black wool coat, dark turtleneck, leather gloves, gold signet ring.', requiredGear: ['Suppressed Pistol', 'Black Balaclava / Bag', 'Radio'] },
        { rankRange: 'Rank 8', title: 'Clan Brigadier', skinId: 'Skin ID #127', gender: 'male', description: 'Tailored black Italian pinstripe suit, burgundy tie, polished leather oxfords.', requiredGear: ['Signet Ring', 'Engraved Sidearm', 'Ledger'] },
        { rankRange: 'Rank 9–10', title: 'Deputy / Supreme Leader (3 DEPs & Leader)', skinId: 'Skin ID #124', gender: 'male', description: 'Bespoke obsidian coat with velvet lapels, platinum watch, gold signet ring.', requiredGear: ['Vor Stars', 'Vault Master Key', 'Encrypted Comms'] }
      ],
      femaleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Novice / Courier', skinId: 'Skin ID #226', gender: 'female', description: 'Black fitted jacket, cargo pants, combat boots, concealed holster, dark beanie.', requiredGear: ['Concealed Handgun', 'Rope', 'Radio'] },
        { rankRange: 'Ranks 4–7', title: 'Senior Associate', skinId: 'Skin ID #193', gender: 'female', description: 'Noir leather trench coat, turtleneck, dark sunglasses, leather gloves, combat blade.', requiredGear: ['Compact SMG', 'Black Mask', 'Radio'] },
        { rankRange: 'Rank 8', title: 'Brigadier', skinId: 'Skin ID #214', gender: 'female', description: 'Tailored designer dark velvet dress, faux fur stole, luxury diamond necklace.', requiredGear: ['Clan Ring', 'Sidearm', 'Ledger'] },
        { rankRange: 'Rank 9–10', title: 'Deputy / Clan Matriarch (3 DEPs & Leader)', skinId: 'Skin ID #192', gender: 'female', description: 'Bespoke couture noir suit with gold embroidery, diamond earrings, walking stick.', requiredGear: ['Seal Ring', 'Master Keycard', 'Cartel Comms'] }
      ]
    },
    members: [
      { id: 'cauc-m1', name: 'Sam_Alexander', rankTitle: 'Supreme Leader (Rank 10 - Leader)', rankLevel: 10, dutyHoursThisWeek: 41, completedTasks: 67, infractions: 0, status: 'on_duty', commendations: 7 },
      { id: 'cauc-m2', name: 'Magomed_Aliev', rankTitle: 'Deputy Authority (Rank 9 - DEP 1)', rankLevel: 9, dutyHoursThisWeek: 38, completedTasks: 62, infractions: 0, status: 'on_duty', commendations: 5, isDeputySlot: true },
      { id: 'cauc-m3', name: 'Murad_Isaev', rankTitle: 'Deputy Authority (Rank 9 - DEP 2)', rankLevel: 9, dutyHoursThisWeek: 35, completedTasks: 55, infractions: 0, status: 'on_duty', commendations: 4, isDeputySlot: true },
      { id: 'cauc-m4', name: 'Zelimkhan_Basaev', rankTitle: 'Deputy Authority (Rank 9 - DEP 3)', rankLevel: 9, dutyHoursThisWeek: 32, completedTasks: 50, infractions: 0, status: 'off_duty', commendations: 4, isDeputySlot: true }
    ]
  },

  // 9. KURGAN OCG
  {
    id: 'kurgan_ocg',
    name: 'Kurgan Organized Crime Group (Kurgan OCG)',
    shortName: 'Kurgan OCG',
    sector: 'ocg',
    category: 'underground',
    tagline: 'Ruthless Contract Enforcers, Heavy Weapon Heists & Contraband Supply Ring',
    leaderTitle: 'Vor v Zakone / Kurgan Syndicate Boss (Rank 10)',
    currentLeader: 'Vacant',
    deputies: ['Stanislav_Krotov', 'Oleg_Chekalin', 'Gennady_Vorobiev'],
    badgeImage: syndicateBadge,
    accentColor: '#fb7185',
    stats: {
      activeMembers: 46,
      onDutyNow: 15,
      weeklyDutyHours: 440,
      budgetBalance: '₽ 81,000,000',
      warehouseStock: '150,000 materials & heavy contraband',
      quotaCompletionPercent: 92,
      weeklyPerformanceGrade: 'A',
      curatorNotes: 'Military convoy heist conducted strictly under server timer rules. Regular member checkups.',
      warningsCount: 0,
    },
    ranks: createRanks([
      'Rank 1: Novice (Bratan)',
      'Rank 2: Enforcer (Torpedo)',
      'Rank 3: Gunsmith (Master)',
      'Rank 4: Shadow (Ten)',
      'Rank 5: Liquidation Specialist',
      'Rank 6: Squad Commander (Krest)',
      'Rank 7: Senior Authority (Kurganets)',
      'Rank 8: Syndicate Overseer',
      'Rank 9: Underboss / Deputy (3 DEPs Only)',
      'Rank 10: Vor v Zakone / Boss (Leader)'
    ]),
    commands: OCG_SHARED_COMMANDS,
    dressCode: {
      rules: [
        'Dark utilitarian noir combat jackets or sleek bespoke black pinstripe suits.',
        'Balaclava and gloves required during active bank or convoy operations.',
        'Boss and Deputies wear executive pinstripe attire with gold accessories.'
      ],
      prohibitedItems: ['Colorful sportswear, funny hats', 'Non-RP masks'],
      maleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Novice / Enforcer', skinId: 'Skin ID #125', gender: 'male', description: 'Black leather jacket, heavy boots, dark trousers, brass knuckles, concealed holster.', requiredGear: ['Concealed Handgun', 'Rope', 'Burner Phone'] },
        { rankRange: 'Ranks 4–7', title: 'Shadow / Squad Leader', skinId: 'Skin ID #111', gender: 'male', description: 'Dark charcoal wool trench coat, turtleneck, leather gloves, gold ring.', requiredGear: ['Suppressed Pistol', 'Black Balaclava / Bag', 'Radio'] },
        { rankRange: 'Rank 8', title: 'Syndicate Overseer', skinId: 'Skin ID #127', gender: 'male', description: 'Pinstripe Italian tailored wool suit, luxury watch, signet ring.', requiredGear: ['Signet Ring', 'Engraved Sidearm', 'Safe Key'] },
        { rankRange: 'Rank 9–10', title: 'Underboss / Boss of Kurgan (3 DEPs & Leader)', skinId: 'Skin ID #124', gender: 'male', description: 'Double-breasted black tailored suit, platinum watch, custom embroidered star lapel.', requiredGear: ['Vor Stars', 'Vault Master Key', 'Black Market Comms'] }
      ],
      femaleUniforms: [
        { rankRange: 'Ranks 1–3', title: 'Novice / Enforcer', skinId: 'Skin ID #226', gender: 'female', description: 'Fitted black leather jacket, cargo pants, combat boots, concealed holster.', requiredGear: ['Handgun', 'Rope', 'Radio'] },
        { rankRange: 'Ranks 4–7', title: 'Squad Leader', skinId: 'Skin ID #193', gender: 'female', description: 'Noir leather trench coat, turtleneck, dark sunglasses, leather gloves, combat knife.', requiredGear: ['Compact SMG', 'Black Mask', 'Radio'] },
        { rankRange: 'Rank 8', title: 'Overseer', skinId: 'Skin ID #214', gender: 'female', description: 'Tailored designer dark velvet dress, faux fur stole, diamond jewelry.', requiredGear: ['Diamond Ring', 'Sidearm', 'Ledger'] },
        { rankRange: 'Rank 9–10', title: 'Underboss / Boss (3 DEPs & Leader)', skinId: 'Skin ID #192', gender: 'female', description: 'Bespoke couture noir suit with gold embroidery, diamond earrings, executive bag.', requiredGear: ['Seal Ring', 'Master Keycard', 'Cartel Comms'] }
      ]
    },
    members: [
      { id: 'krg-m1', name: 'Vacant', rankTitle: 'Vor v Zakone (Rank 10 - Leader)', rankLevel: 10, dutyHoursThisWeek: 0, completedTasks: 0, infractions: 0, status: 'off_duty', commendations: 0 },
      { id: 'krg-m2', name: 'Stanislav_Krotov', rankTitle: 'Underboss / Deputy (Rank 9 - DEP 1)', rankLevel: 9, dutyHoursThisWeek: 39, completedTasks: 64, infractions: 0, status: 'on_duty', commendations: 6, isDeputySlot: true },
      { id: 'krg-m3', name: 'Oleg_Chekalin', rankTitle: 'Underboss / Deputy (Rank 9 - DEP 2)', rankLevel: 9, dutyHoursThisWeek: 35, completedTasks: 57, infractions: 0, status: 'on_duty', commendations: 4, isDeputySlot: true },
      { id: 'krg-m4', name: 'Gennady_Vorobiev', rankTitle: 'Underboss / Deputy (Rank 9 - DEP 3)', rankLevel: 9, dutyHoursThisWeek: 31, completedTasks: 49, infractions: 0, status: 'off_duty', commendations: 3, isDeputySlot: true }
    ]
  }
];

export const INITIAL_COMPLAINTS: PlayerComplaint[] = [];

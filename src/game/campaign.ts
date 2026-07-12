export const CAMPAIGN_MAX_LEVEL = 20;
const CAMPAIGN_PROGRESS_KEY = 'hex_campaign_unlocked_level';

export function getUnlockedCampaignLevel(): number {
  const raw = Number(localStorage.getItem(CAMPAIGN_PROGRESS_KEY) || '1');
  if (!Number.isFinite(raw)) return 1;
  return Math.max(1, Math.min(CAMPAIGN_MAX_LEVEL, Math.floor(raw)));
}

export function saveUnlockedCampaignLevel(level: number) {
  const current = getUnlockedCampaignLevel();
  const next = Math.max(1, Math.min(CAMPAIGN_MAX_LEVEL, Math.floor(level)));
  if (next > current) {
    localStorage.setItem(CAMPAIGN_PROGRESS_KEY, String(next));
  }
}

export function getCampaignLevelTitle(level: number): string {
  if (level <= 2) return 'Training Grounds';
  if (level <= 4) return 'Red Expansion';
  if (level <= 7) return 'Broken Frontline';
  if (level <= 10) return 'Center Clash';
  if (level <= 14) return 'Enemy Surge';
  return 'Final Dominion';
}

type CampaignObjectiveType =
  | 'eliminate_red'
  | 'win_within_turns'
  | 'control_territory'
  | 'hold_center'
  | 'survive_turns';

type CampaignObjective = {
  type: CampaignObjectiveType;
  title: string;
  description: string;
  target?: number;
  starTurnLimit?: number;
  starTerritoryPercent?: number;
};

const CAMPAIGN_STARS_KEY = 'hex_campaign_level_stars';

const CAMPAIGN_OBJECTIVES: Record<number, CampaignObjective> = {
  1: { type: 'eliminate_red', title: 'First Contact', description: 'Eliminate all Red territories.', starTurnLimit: 28, starTerritoryPercent: 65 },
  2: { type: 'win_within_turns', title: 'Quick Victory', description: 'Defeat Red within 60 turns.', target: 60, starTurnLimit: 16, starTerritoryPercent: 65 },
  3: { type: 'control_territory', title: 'Territory Push', description: 'Control at least 60% of the board.', target: 60, starTurnLimit: 24, starTerritoryPercent: 70 },
  4: { type: 'hold_center', title: 'Central Control', description: 'Control the center hex for 3 turns.', target: 3, starTurnLimit: 24, starTerritoryPercent: 65 },
  5: { type: 'eliminate_red', title: 'Outnumbered', description: 'Win against a stronger Red opening.', starTurnLimit: 30, starTerritoryPercent: 68 },
  6: { type: 'control_territory', title: 'Dominance', description: 'Control at least 70% of the board.', target: 70, starTurnLimit: 26, starTerritoryPercent: 78 },
  7: { type: 'win_within_turns', title: 'Blitz', description: 'Defeat Red within 15 turns.', target: 15, starTurnLimit: 12, starTerritoryPercent: 70 },
  8: { type: 'survive_turns', title: 'Survival Line', description: 'Survive for 25 turns.', target: 25, starTurnLimit: 25, starTerritoryPercent: 55 },
  9: { type: 'control_territory', title: 'Expansion Master', description: 'Control at least 75% of the board.', target: 75, starTurnLimit: 28, starTerritoryPercent: 82 },
  10: { type: 'hold_center', title: 'Fortress Core', description: 'Control the center hex for 5 turns.', target: 5, starTurnLimit: 30, starTerritoryPercent: 72 },
  11: { type: 'eliminate_red', title: 'Divide and Conquer', description: 'Eliminate all Red territories.', starTurnLimit: 28, starTerritoryPercent: 72 },
  12: { type: 'control_territory', title: 'Efficient Commander', description: 'Control at least 70% of the board.', target: 70, starTurnLimit: 24, starTerritoryPercent: 80 },
  13: { type: 'survive_turns', title: 'Border War', description: 'Survive for 30 turns.', target: 30, starTurnLimit: 30, starTerritoryPercent: 60 },
  14: { type: 'hold_center', title: 'Superior Position', description: 'Control the center hex for 6 turns.', target: 6, starTurnLimit: 28, starTerritoryPercent: 75 },
  15: { type: 'eliminate_red', title: 'Comeback King', description: 'Eliminate all Red territories.', starTurnLimit: 32, starTerritoryPercent: 75 },
  16: { type: 'hold_center', title: 'No Retreat', description: 'Control the center hex for 7 turns.', target: 7, starTurnLimit: 30, starTerritoryPercent: 78 },
  17: { type: 'win_within_turns', title: 'Attrition', description: 'Defeat Red within 30 turns.', target: 30, starTurnLimit: 24, starTerritoryPercent: 78 },
  18: { type: 'win_within_turns', title: 'Surgical Strike', description: 'Defeat Red within 25 turns.', target: 25, starTurnLimit: 20, starTerritoryPercent: 80 },
  19: { type: 'control_territory', title: 'World Domination', description: 'Control at least 85% of the board.', target: 85, starTurnLimit: 32, starTerritoryPercent: 90 },
  20: { type: 'eliminate_red', title: 'Final Conquest', description: 'Eliminate Red and dominate the board.', starTurnLimit: 20, starTerritoryPercent: 80 },
};

export function getCampaignObjective(level: number): CampaignObjective {
  return CAMPAIGN_OBJECTIVES[level] ?? CAMPAIGN_OBJECTIVES[1];
}

export function getCampaignStarsMap(): Record<string, number> {
  try {
    const raw = localStorage.getItem(CAMPAIGN_STARS_KEY);
    return raw ? JSON.parse(raw) as Record<string, number> : {};
  } catch {
    return {};
  }
}

export function getSavedCampaignStars(level: number): number {
  const stars = getCampaignStarsMap()[String(level)] ?? 0;
  return Math.max(0, Math.min(3, Number(stars) || 0));
}

export function saveCampaignStars(level: number, stars: number) {
  const map = getCampaignStarsMap();
  const key = String(level);
  const current = Math.max(0, Math.min(3, Number(map[key]) || 0));
  const next = Math.max(0, Math.min(3, Math.floor(stars)));
  if (next > current) {
    map[key] = next;
    localStorage.setItem(CAMPAIGN_STARS_KEY, JSON.stringify(map));
  }
}

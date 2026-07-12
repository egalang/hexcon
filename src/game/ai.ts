type AiDifficulty = 'easy' | 'normal' | 'hard' | 'expert';
type AiPersonality = 'balanced' | 'aggressive' | 'defensive' | 'center' | 'chaotic';

type AiStats = {
  wins: number;
  losses: number;
  streak: number;
  bestWinTurns: number | null;
  lastDifficulty: AiDifficulty;
  lastPersonality: AiPersonality;
};

const AI_SETTINGS_KEY = 'hex_ai_settings';
const AI_STATS_KEY = 'hex_ai_stats';

const AI_DIFFICULTIES: AiDifficulty[] = ['easy', 'normal', 'hard', 'expert'];
const AI_PERSONALITIES: AiPersonality[] = ['balanced', 'aggressive', 'defensive', 'center', 'chaotic'];

export function formatAiDifficulty(value: AiDifficulty) {
  if (value === 'easy') return 'Easy';
  if (value === 'normal') return 'Normal';
  if (value === 'hard') return 'Hard';
  return 'Expert';
}

export function formatAiPersonality(value: AiPersonality) {
  if (value === 'balanced') return 'Balanced';
  if (value === 'aggressive') return 'Aggressive';
  if (value === 'defensive') return 'Defensive';
  if (value === 'center') return 'Center Control';
  return 'Chaotic';
}

export function isAiDifficulty(value: unknown): value is AiDifficulty {
  return value === 'easy' || value === 'normal' || value === 'hard' || value === 'expert';
}

export function isAiPersonality(value: unknown): value is AiPersonality {
  return value === 'balanced' || value === 'aggressive' || value === 'defensive' || value === 'center' || value === 'chaotic';
}

export function getSavedAiSettings(): { difficulty: AiDifficulty; personality: AiPersonality } {
  try {
    const raw = localStorage.getItem(AI_SETTINGS_KEY);
    const parsed = raw ? JSON.parse(raw) as Record<string, unknown> : {};
    const difficulty = isAiDifficulty(parsed.difficulty) ? parsed.difficulty : 'normal';
    const personality = isAiPersonality(parsed.personality) ? parsed.personality : 'balanced';
    return { difficulty, personality };
  } catch {
    return { difficulty: 'normal', personality: 'balanced' };
  }
}

export function saveAiSettings(difficulty: AiDifficulty, personality: AiPersonality) {
  localStorage.setItem(AI_SETTINGS_KEY, JSON.stringify({ difficulty, personality }));
}

export function getAiStats(): AiStats {
  try {
    const raw = localStorage.getItem(AI_STATS_KEY);
    const parsed = raw ? JSON.parse(raw) as Partial<AiStats> : {};
    const settings = getSavedAiSettings();
    return {
      wins: Number(parsed.wins) || 0,
      losses: Number(parsed.losses) || 0,
      streak: Number(parsed.streak) || 0,
      bestWinTurns: typeof parsed.bestWinTurns === 'number' ? parsed.bestWinTurns : null,
      lastDifficulty: isAiDifficulty(parsed.lastDifficulty) ? parsed.lastDifficulty : settings.difficulty,
      lastPersonality: isAiPersonality(parsed.lastPersonality) ? parsed.lastPersonality : settings.personality,
    };
  } catch {
    const settings = getSavedAiSettings();
    return { wins: 0, losses: 0, streak: 0, bestWinTurns: null, lastDifficulty: settings.difficulty, lastPersonality: settings.personality };
  }
}

export function saveAiMatchResult(playerWon: boolean, turns: number, difficulty: AiDifficulty, personality: AiPersonality) {
  const stats = getAiStats();
  if (playerWon) {
    stats.wins += 1;
    stats.streak = Math.max(1, stats.streak + 1);
    stats.bestWinTurns = stats.bestWinTurns === null ? turns : Math.min(stats.bestWinTurns, turns);
  } else {
    stats.losses += 1;
    stats.streak = Math.min(-1, stats.streak - 1);
  }
  stats.lastDifficulty = difficulty;
  stats.lastPersonality = personality;
  localStorage.setItem(AI_STATS_KEY, JSON.stringify(stats));
}

export function getAiDifficultyDescription(value: AiDifficulty) {
  if (value === 'easy') return 'Learns slowly and sometimes chooses weak moves.';
  if (value === 'normal') return 'Uses the current balanced strategy.';
  if (value === 'hard') return 'Stronger scoring with fewer random mistakes.';
  return 'Scores position and checks likely counterplay.';
}

export function getAiPersonalityDescription(value: AiPersonality) {
  if (value === 'aggressive') return 'Prioritizes big conversions.';
  if (value === 'defensive') return 'Protects territory and avoids risky trades.';
  if (value === 'center') return 'Fights hard for the middle of the board.';
  if (value === 'chaotic') return 'More random and unpredictable.';
  return 'Balanced conversions, center control, and safety.';
}

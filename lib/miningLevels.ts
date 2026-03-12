export interface LevelConfig {
  level: number;
  ptsPerMin: number;
  upgradeCost: number; // USDC
}

export const levels: LevelConfig[] = Array.from({ length: 30 }).map((_, i) => {
  const level = i + 1;

  return {
    level,
    ptsPerMin: Number((0.05 + i * 0.02).toFixed(3)),
    upgradeCost: Number((0.5 + i * 0.4).toFixed(2)),
  };
});
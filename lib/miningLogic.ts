export function calculateOfflineEarnings(
  lastUpdate: number,
  ptsPerMin: number
) {
  const now = Date.now();
  const diffMinutes = (now - lastUpdate) / 60000;

  return diffMinutes * ptsPerMin;
}
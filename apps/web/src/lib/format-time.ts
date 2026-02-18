export function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  if (sec === 0) return `${min}min`
  return `${min}min ${sec}s`
}

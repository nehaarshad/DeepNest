export function calculateRemainingTime(
  startTime: number,
  durationMs: number
) {
  const now = Date.now()
  const elapsed = now - startTime
  const remaining = durationMs - elapsed

  return Math.max(remaining, 0)
}

export function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}
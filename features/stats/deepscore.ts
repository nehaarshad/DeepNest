import Session from "../sessions/sessiontype"

export function calculateDeepScore(sessions: Session[]) {
 const totalMinutes = sessions.reduce(
  (sum, s) => sum + Math.max(0, (s.duration - s.remaining)),
  0
)

  const sessionCount = sessions.length

  const consistencyBonus = sessionCount > 3 ? 20 : 0

  const score =
    totalMinutes * 0.6 +
    sessionCount * 10 +
    consistencyBonus

  return Math.round(score)
}
import Session from "../features/sessions/sessiontype";

const SESSIONS_KEY = "deepnest_sessions"

export const storage = {
  getSessions: () => {
    if (typeof window === "undefined") return []
    const raw = localStorage.getItem(SESSIONS_KEY)
    return raw ? JSON.parse(raw) : []
  },

  saveSessions: (sessions: Session[]) => {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions))
  }
}
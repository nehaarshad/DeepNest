import { create } from "zustand"
import { storage } from "@/lib/storage"
import  Session  from "./sessiontype"
import { v4 as uuid } from "uuid"

interface SessionState {
  sessions: Session[]
  addSession: (duration: number,status?: string) => string
  updateSession: (id: string,updates: Partial<Session>) => void
  loadSessions: () => void
  deleteSession: (id: string) => void
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessions: [],

  loadSessions: () => {
    const stored = storage.getSessions() || []
    set({ sessions: stored })
  },

  addSession: (duration,status = "abandoned") => {
    const newSession: Session = {
      id: uuid(),
      duration,
      remaining: duration,
      endedAt: undefined,
      startedAt: new Date().toISOString(),
      status: status
    }

    const updated = [...get().sessions, newSession]
    storage.saveSessions(updated)
    set({ sessions: updated })
      return newSession.id
  },

 updateSession: (id, updates) => {
  const sessions = get().sessions
  const session = sessions.find(s => s.id === id)
  if (session) {
    Object.assign(session, updates) // modifies existing object
  }
  console.log("Updated session:", session)
  console.log("All sessions after update:", sessions)
  storage.saveSessions(sessions)
  set({ sessions })
},


  deleteSession: (id) => {
    const updated = get().sessions.filter((s) => s.id !== id)
    storage.saveSessions(updated)
    set({ sessions: updated })
  }

}))
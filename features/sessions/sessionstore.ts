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

  updateSession: (id,updates) => {
    const updated = get().sessions.map((s) =>
      s.id === id
        ? ({ ...s, ...updates } )
        : s
    )

    storage.saveSessions(updated)
    set({ sessions: updated })
  },

  deleteSession: (id) => {
    const updated = get().sessions.filter((s) => s.id !== id)
    storage.saveSessions(updated)
    set({ sessions: updated })
  }

}))
import { create } from "zustand"
import { calculateRemainingTime } from "./timerlogic"
import { useSessionStore } from "../sessions/sessionstore"

interface TimerState {
  isSessionCompleteModalOpen: boolean
  duration: number
  startTime: number | null
  remaining: number
  isRunning: boolean
  runningSessionId: string | null

  start: (minutes: number) => void
  continue: (minutes: number) => void
  pause: () => void
  reset: () => void
  tick: () => void
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isSessionCompleteModalOpen: false,
  duration: 0,
  startTime: null,
  remaining: 0,
  isRunning: false,
  runningSessionId: null,

  start: (minutes) => {
    const durationMs = minutes * 60 * 1000
    const sessionId = useSessionStore.getState().addSession(minutes, "abandoned")

    set({
      duration: durationMs,
      startTime: Date.now(),
      remaining: durationMs,
      isRunning: true,
      runningSessionId: sessionId
    })
  },

   continue: (minutes) => {
    const durationMs = minutes * 60 * 1000
    const sessionId = get().runningSessionId 


    set({
      duration: durationMs,
      startTime: Date.now(),
      remaining: durationMs,
      isRunning: true,
      runningSessionId: sessionId
    })
  },

  pause: () => {
    const { runningSessionId, remaining } = get()
    if (runningSessionId) {
      useSessionStore.getState().updateSession(runningSessionId, {
        remaining,
        status: "abandoned"
      })
    }
    set({ isRunning: false })
  },

  reset: () => {
    set({
      duration: 0,
      startTime: null,
      remaining: 0,
      isRunning: false,
      runningSessionId: null
    })
  },

  tick: () => {
    const { startTime, duration, isRunning, runningSessionId } = get()
    if (!startTime || !isRunning) return

    const remaining = calculateRemainingTime(startTime, duration)

    if (runningSessionId) {
      // update session remaining in real-time
      useSessionStore.getState().updateSession(runningSessionId, {
        remaining,
      })
    }

    if (remaining === 0) {
      if (runningSessionId) {
        useSessionStore.getState().updateSession(runningSessionId, {
          remaining: 0,
          status: "completed",
          endedAt: new Date().toISOString()
        })
      }

        if (typeof Audio !== "undefined") {
    const audio = new Audio("/sound/win.mp3")
    audio.play().catch(e => console.log("Audio play failed:", e))
  }

      set({
          isSessionCompleteModalOpen: true,
        remaining: 0,
        duration: 0,
        startTime: null,
        isRunning: false,
        runningSessionId: null
      })
      return
    }

    set({ remaining })
  }
}))
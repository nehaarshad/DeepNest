import { create } from "zustand"
import type { ComponentType } from "react"

interface SessionCompleteModalState {
  Component: ComponentType
  isOpen: boolean
  message: string
  open: (msg?: string) => void
  close: () => void
}

export const useCompleteSessionDialogue = create<SessionCompleteModalState>((set) => ({
  Component: () => null,
  isOpen: false, // Start closed
  message: "🎉 Focus Complete!",
  open: (msg) => {
    // Play sound
    if (typeof Audio !== "undefined") {
      const audio = new Audio("/sound/win.mp3") // Remove "../public" from path
      audio.play().catch(e => console.log("Audio play failed:", e))
    }

    set({
      isOpen: true,
      message: msg || "🎉 Focus Complete!"
    })
  },
  close: () => set({ isOpen: false })
}))
import { create } from "zustand"

interface SessionCompleteModalState {
  isOpen: boolean
  message: string
  open: (msg?: string) => void
  close: () => void
}

export const CompleteSessionDialogueBox = create<SessionCompleteModalState>((set) => ({
  isOpen: false,
  message: "🎉 Focus Complete!",
  open: (msg) => {
    const audio = typeof Audio !== "undefined" ? new Audio("../public/sound/win.mp3") : null
    if (audio) audio.play()

    set({
      isOpen: true,
      message: msg || "🎉 Focus Complete!"
    })
  },
  close: () => set({ isOpen: false })
}))
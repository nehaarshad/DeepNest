"use client"

import { useEffect, useState } from "react"
import { useTimerStore } from "@/features/timer/timerstore"
import { formatTime } from "@/features/timer/timerlogic"
import { useSearchParams } from "next/navigation"
import {CompleteSessionDialogueBox} from "@/components/ui/modal"
import { useSessionStore } from "@/features/sessions/sessionstore"


export default function SessionContent() {
  const { remaining,duration,  isRunning, start, pause, reset, tick } = useTimerStore()

  const [showModal, setShowModal] = useState(false)
  const [inputMinutes, setInputMinutes] = useState(25)
  const [paused, setPaused] = useState(false)
    const modal = CompleteSessionDialogueBox()

// inside the component
const searchParams = useSearchParams()
const continueId = searchParams.get("continue")

useEffect(() => {
  if (continueId) {
    const sessions = useSessionStore.getState().sessions
    const session = sessions.find((s) => s.id === continueId)
    if (session) {
      start(session.duration) // or remaining duration
    }
  }
}, [continueId, start])
  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        tick()
        // Check if remaining just hit 0
        if (remaining <= 0 && !modal.isOpen) {
          modal.open("🎉 Focus Complete!")
        }
      }, 1000)
    }
    return () => interval && clearInterval(interval)
  }, [isRunning, tick, remaining, modal])


  // When timer completes, show modal
  // Handle starting a new session
  const handleStart = () => {
    start(inputMinutes)
    setShowModal(false)
    setPaused(false)
  }

  // Handle pause
  const handlePause = () => {
    pause()
    setPaused(true)
  }

  // Handle continue
  const handleContinue = () => {
    start(remaining / 60 / 1000) // resume with remaining time
    setPaused(false)
  }

  return (
  <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold">Deep Session</h1>
        <div className="text-7xl font-mono">{formatTime(remaining)}</div>

        <div className="flex gap-4 justify-center">
          {!isRunning && !paused && duration === 0 && remaining === 0 && (
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600  hover:bg-indigo-500 px-6 py-3 rounded-xl"
            >
              Start Session
            </button>
          )}

          {isRunning && (
            <button
              onClick={handlePause}
              className="bg-red-600 px-6 py-3 rounded-xl"
            >
              Pause
            </button>
          )}

          {!isRunning && paused && remaining > 0 && (
            <button
              onClick={handleContinue}
              className="bg-green-600 px-6 py-3 rounded-xl"
            >
              Continue
            </button>
          )}

          <button onClick={reset} className="bg-slate-700 px-6 py-3 rounded-xl">
            Reset
          </button>
        </div>

        <div className="mt-10">
          <a
            href="/dashboard"
            className="bg-amber-600 hover:bg-amber-500 px-20 py-3 rounded-xl text-lg font-medium"
          >
            Cancel
          </a>
        </div>
      </div>

      {/* Modal for setting duration */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-xl w-80 space-y-4">
            <h2 className="text-xl font-bold">Set Focus Time (minutes)</h2>
            <input
              title="set focus time in minutes"
              type="number"
              min={1}
              max={180}
              value={inputMinutes}
              onChange={(e) => setInputMinutes(Number(e.target.value))}
              className="w-full p-2 rounded bg-slate-700 text-white text-center"
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-slate-700 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 rounded"
                onClick={handleStart}
              >
                Start
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-slate-700 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              
            </div>
        </div>
        
      )}
      
    </main>
    
   
  )
}
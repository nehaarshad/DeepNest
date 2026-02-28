"use client"

import { useEffect, useState } from "react"
import { useTimerStore } from "@/features/timer/timerstore"
import { formatTime } from "@/features/timer/timerlogic"
import { useSearchParams } from "next/navigation"
import {useCompleteSessionDialogue} from "@/components/ui/modal"
import { useSessionStore } from "@/features/sessions/sessionstore"


export default function SessionContent() {
  const { remaining,duration,  isRunning,isSessionCompleteModalOpen, continue: continueSession,start, pause, reset, tick } = useTimerStore()

  const [showModal, setShowModal] = useState(false)
  const [inputMinutes, setInputMinutes] = useState(25)
  const [paused, setPaused] = useState(false)
    const modal = useCompleteSessionDialogue()

// inside the component
const searchParams = useSearchParams()
const continueId = searchParams.get("continue")

useEffect(() => {
  if (continueId) {
    const sessions = useSessionStore.getState().sessions
    const session = sessions.find((s) => s.id === continueId)
    if (session) {
      continueSession(session.remaining / 60 / 1000) // or remaining duration
    }
  }
}, [continueId, continueSession])
  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        tick()
        
      }, 1000)
    }
    return () => interval && clearInterval(interval)
  }, [isRunning, tick, remaining,])


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
    continueSession(remaining / 60 / 1000) // resume with remaining time
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
              Start New Session
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
              {!isRunning && !paused && duration === 0 && remaining === 0 && (
          <a
            href="/dashboard"
            className="bg-amber-600 hover:bg-amber-500 px-20 py-3 rounded-xl text-lg font-medium"
          >
            Cancel
          </a>
              )}
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
        </div>  
        
      )}
       {/* Completion Modal - Add this JSX */}
      {isSessionCompleteModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
    <div className="bg-slate-800 p-8 rounded-2xl w-80 space-y-6 text-center shadow-xl">
      <div className="text-5xl">🎉</div>
      <h2 className="text-2xl font-bold">Focus Complete!</h2>
      <p className="text-slate-400">Great work! Your session is done.</p>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => {
            useTimerStore.setState({ isSessionCompleteModalOpen: false })
            setShowModal(true) // let them start a new one
          }}
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl font-medium"
        >
          Start Another
        </button>
        <a
          href="/dashboard"
          className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-medium"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  </div>
)}
      
    </main>
    
   
  )
}
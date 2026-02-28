"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSessionStore } from "@/features/sessions/sessionstore"
import { calculateDeepScore } from "@/features/stats/deepscore"
import StatCard from "@/components/dashboard/deepscorecard"

export default function DashboardPage() {
  const { sessions, loadSessions } = useSessionStore()

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

 const totalMinutes = sessions.reduce(
  (sum, s) => sum + Math.max(0, (s.duration - s.remaining)),
  0
)

  const deepScore = calculateDeepScore(sessions)

  // Filter paused/abandoned sessions
  const pausedSessions = sessions.filter((s) => s.status === "abandoned")

  return (
    <main className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">DeepNest Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <StatCard title="Focus Minutes" value={totalMinutes} />
          <StatCard title="Sessions" value={sessions.length} />
          <StatCard title="Deep Score" value={deepScore} />
        </div>

         {/* Start New Session */}
        <div className="mt-10 flex justify-end">
          <Link
            href="/session"
            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-xl text-lg font-medium"
          >
            Start New Session
          </Link>
        </div>

        {/* Sessions Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Your Sessions</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-2">#</th>
                <th className="p-2">Start Time</th>
                <th className="p-2">End Time</th>
                <th className="p-2">Duration</th>
                <th className="p-2">Remaining</th>
                <th className="p-2">Status</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s, idx) => (
                <tr key={s.id} className="border-b border-slate-800">
                  <td className="p-2">{idx + 1}</td>
                  <td className="p-2">{new Date(s.startedAt).toLocaleString()}</td>
                  <td className="p-2">
                    {s.endedAt ? new Date(s.endedAt).toLocaleString() : "-"}
                  </td>
                  <td className="p-2">{s.duration} min</td>
                  <td className="p-2  flex justify-center">{(s.remaining / 60 / 1000).toFixed(0).padStart(2, "0") === "00" ? "--" : `${(s.remaining / 60 / 1000).toFixed(0)} min`}</td>
                  <td className="p-2 capitalize">{s.status}</td>
                  <td className="p-2">
                    
                    <button
                      onClick={() => useSessionStore.getState().deleteSession(s.id)}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-500 ml-2"
                       
                      >
                        Delete
                      </button>
                      {s.status === "abandoned" && (
                      <Link
                        href={`/session?continue=${s.id}`}
                        className="bg-green-600 px-3 py-2 rounded hover:bg-green-500 ml-2"
                      >
                        Continue
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

          {/* Paused Sessions */}
          {pausedSessions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Paused Sessions</h2>
              <ul className="list-disc list-inside">
                {pausedSessions.map((s) => (
                  <li key={s.id} className="mb-2">
                    <span>
                      Started at {new Date(s.startedAt).toLocaleString()} - Duration: {s.duration} min
                    </span>
                    <Link
                      href={`/session?continue=${s.id}`}
                      className="ml-4 bg-green-600 px-3 py-1 rounded hover:bg-green-500"
                    >
                      Continue
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

      </div>
    </main>
  )
}

// Summary card component


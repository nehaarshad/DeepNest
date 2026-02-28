
export default interface Session {
  id: string
  duration: number   
  remaining: number       // minutes planned
  startedAt: string         // ISO string
  endedAt?: string          // ISO string
  status: string
}
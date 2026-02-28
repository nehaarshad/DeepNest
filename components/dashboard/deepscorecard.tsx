export default function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl text-center">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  )
}
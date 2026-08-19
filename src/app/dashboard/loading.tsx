export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse p-4">
      {/* Title skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-64 bg-neutral-900 rounded-lg" />
        <div className="h-4 w-96 bg-neutral-900/60 rounded-md" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-neutral-900 border border-white/5 rounded-2xl p-6 h-36 flex flex-col justify-between" />
        ))}
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 h-64" />
        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-6 h-64" />
      </div>
    </div>
  );
}

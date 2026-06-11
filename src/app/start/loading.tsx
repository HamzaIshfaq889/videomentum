export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0E0E10]">
      {/* Hero skeleton */}
      <section className="px-6 pb-12 text-center sm:px-12 sm:pt-14">
        <div className="mx-auto mb-5 h-16 w-96 max-w-full animate-pulse rounded-lg bg-zinc-800/50" />
        <div className="mx-auto h-6 w-125 max-w-full animate-pulse rounded bg-zinc-800/30" />
      </section>

      {/* Info strip skeleton */}
      <section className="mx-auto mb-14 max-w-4xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-2xl border border-zinc-800 bg-[#141416]"
            />
          ))}
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-96 animate-pulse rounded-2xl border border-zinc-800 bg-[#141416]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

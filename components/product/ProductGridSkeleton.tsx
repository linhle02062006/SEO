export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-xl border border-ink-200 bg-white"
        >
          <div className="skeleton aspect-square" />
          <div className="space-y-2 p-3.5">
            <div className="skeleton h-3 w-1/3 rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
            <div className="skeleton h-5 w-1/2 rounded" />
            <div className="skeleton h-9 w-full rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}

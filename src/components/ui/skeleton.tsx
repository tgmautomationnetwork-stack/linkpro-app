export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-neutral-200 rounded ${className}`} />
  );
}

export function ProductTableSkeleton() {
  return (
    <div className="rounded-lg bg-white border border-neutral-200 overflow-hidden">
      <table className="w-full">
        <thead className="border-b border-neutral-200">
          <tr className="text-left">
            <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Product</th>
            <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Price</th>
            <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Category</th>
            <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Views</th>
            <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Status</th>
            <th className="px-4 py-3 text-[13px] font-medium text-neutral-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {[...Array(5)].map((_, i) => (
            <tr key={i}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-20" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-16" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-4 w-8" />
              </td>
              <td className="px-4 py-3">
                <Skeleton className="h-5 w-20" />
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <Skeleton className="w-7 h-7" />
                  <Skeleton className="w-7 h-7" />
                  <Skeleton className="w-7 h-7" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="p-4 rounded-lg bg-white border border-neutral-200">
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-6 w-12" />
        </div>
      ))}
    </div>
  );
}

export function AnalyticsChartSkeleton() {
  return (
    <div className="p-6 rounded-lg bg-white border border-neutral-200">
      <Skeleton className="h-5 w-32 mb-4" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

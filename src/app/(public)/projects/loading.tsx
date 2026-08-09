function ProjectSkeletonCard() {
  return (
    <div className="h-full rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900 sm:p-6">
      <div className="animate-pulse space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="space-y-3">
          <div className="h-5 w-4/5 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-11/12 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
        </div>
        <div className="h-16 rounded-xl bg-slate-100 dark:bg-slate-950" />
        <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  )
}

export default function ProjectsLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 dark:bg-slate-950">
      <div className="relative overflow-hidden border-b border-slate-800 bg-slate-900 py-16 text-white sm:py-20">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative mx-auto max-w-7xl space-y-4 px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-72 animate-pulse rounded bg-white/15 sm:h-14" />
          <div className="h-4 w-full max-w-xl animate-pulse rounded bg-white/10" />
        </div>
      </div>

      <main className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProjectSkeletonCard key={index} />
          ))}
        </div>
      </main>
    </div>
  )
}

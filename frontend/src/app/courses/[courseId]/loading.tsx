export default function CourseDetailLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="h-5 w-36 animate-pulse rounded bg-primary/15" />
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="h-72 animate-pulse rounded-lg border border-border bg-surface" />
        <div className="h-72 animate-pulse rounded-lg border border-border bg-surface" />
      </div>
      <div className="mt-8 space-y-3">
        <div className="h-20 animate-pulse rounded-lg border border-border bg-surface" />
        <div className="h-20 animate-pulse rounded-lg border border-border bg-surface" />
        <div className="h-20 animate-pulse rounded-lg border border-border bg-surface" />
      </div>
    </div>
  );
}

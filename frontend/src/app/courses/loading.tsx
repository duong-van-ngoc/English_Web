export default function CoursesLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="h-4 w-20 animate-pulse rounded bg-primary/15" />
        <div className="mt-4 h-10 w-80 animate-pulse rounded bg-surface" />
        <div className="mt-3 h-20 animate-pulse rounded bg-surface" />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-60 animate-pulse rounded-lg border border-border bg-surface" />
        <div className="h-60 animate-pulse rounded-lg border border-border bg-surface" />
        <div className="h-60 animate-pulse rounded-lg border border-border bg-surface" />
      </div>
    </div>
  );
}

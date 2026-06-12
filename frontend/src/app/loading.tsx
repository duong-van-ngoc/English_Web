export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="h-80 animate-pulse rounded-lg border border-border bg-surface" />
        <div className="h-80 animate-pulse rounded-lg bg-primary/15" />
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />
        <div className="h-64 animate-pulse rounded-lg border border-border bg-surface" />
      </div>
    </div>
  );
}

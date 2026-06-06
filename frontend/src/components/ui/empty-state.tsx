interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <section className="glass-panel rounded-md border-dashed p-8 text-center">
      <p className="text-base font-semibold text-text-primary">{title}</p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{description}</p>
    </section>
  );
}

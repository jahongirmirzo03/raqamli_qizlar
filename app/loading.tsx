export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-6 animate-pulse">
      <div className="h-10 w-64 rounded-2xl bg-brand-card border border-brand-primary/15" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-48 rounded-2xl bg-brand-card border border-brand-primary/15" />
        <div className="h-48 rounded-2xl bg-brand-card border border-brand-primary/15" />
      </div>
    </div>
  );
}

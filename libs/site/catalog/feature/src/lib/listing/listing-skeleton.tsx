/** Placeholder while the listing streams: toolbar and a grid of empty cards of the final size. */
export function ListingSkeleton() {
  return (
    <div aria-hidden className="grid animate-pulse gap-4">
      <div className="h-16 rounded-xl bg-muted" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="aspect-[3/4] rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

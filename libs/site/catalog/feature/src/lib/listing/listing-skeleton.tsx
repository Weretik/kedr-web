/** Placeholder while the listing streams: the filter column and a grid of empty cards of the final size. */
export function ListingSkeleton() {
  return (
    <div
      aria-hidden
      className="grid animate-pulse gap-6 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8"
    >
      <div className="hidden h-72 rounded-xl bg-muted lg:block" />
      <div className="grid content-start gap-4">
        <div className="h-9 rounded-md bg-muted" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="aspect-[3/4] rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    </div>
  );
}

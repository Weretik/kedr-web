import { SearchIcon } from 'lucide-react';

/** The category search at the top of the mega menu. */
export function MegaMenuSearchField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (term: string) => void;
  value: string;
}) {
  return (
    <div className="border-b border-border p-3">
      <label className="relative block">
        <span className="sr-only">{label}</span>
        <SearchIcon
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          strokeWidth={1.75}
        />
        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={label}
          autoComplete="off"
          className="h-10 w-full rounded-md border border-border bg-muted pr-3 pl-9 text-sm outline-none focus-visible:border-ring"
        />
      </label>
    </div>
  );
}

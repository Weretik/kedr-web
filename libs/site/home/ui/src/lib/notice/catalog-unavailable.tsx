import Link from 'next/link';

/** Shown instead of the catalog index when the API cannot be reached; the page itself stays 200. */
export function CatalogUnavailable({
  text,
  href,
  label,
}: {
  text: string;
  href: string;
  label: string;
}) {
  return (
    <p
      role="status"
      className="rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground"
    >
      {text}{' '}
      <Link href={href} className="font-medium text-foreground underline">
        {label}
      </Link>
    </p>
  );
}

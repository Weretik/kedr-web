import { NewspaperIcon } from 'lucide-react';
import Image from 'next/image';

/** Both reading and cards reserve the same cover ratio; missing photos stay neutral. */
export function ArticleCover({
  image,
  missingLabel,
  eager = false,
  sizes,
}: {
  image: string | null;
  missingLabel: string;
  eager?: boolean;
  sizes: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-muted">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={missingLabel}
          className="grid h-full w-full place-items-center text-muted-foreground"
        >
          <NewspaperIcon aria-hidden size={40} strokeWidth={1.75} />
        </div>
      )}
    </div>
  );
}

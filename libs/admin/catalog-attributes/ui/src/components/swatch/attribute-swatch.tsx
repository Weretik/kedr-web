import { Box } from '@mui/material';

interface AttributeSwatchProps {
  hex: string | null;
  imageUrl: string | null;
  /** The value name, read by screen readers instead of the picture. */
  label: string;
  size?: number;
}

/** A color dot or a decor texture; nothing for a text-only value. */
export function AttributeSwatch({ hex, imageUrl, label, size = 24 }: AttributeSwatchProps) {
  if (!hex && !imageUrl) return null;

  return (
    <Box
      aria-label={label}
      role="img"
      sx={{
        backgroundColor: hex ?? 'transparent',
        backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        border: 1,
        borderColor: 'divider',
        borderRadius: '50%',
        flex: '0 0 auto',
        height: size,
        width: size,
      }}
    />
  );
}

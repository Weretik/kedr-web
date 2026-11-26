import { Link, Typography } from '@mui/material';

interface ProductsModelCellProps {
  modelId: number | null;
  onOpen: (modelId: number) => void;
}

/** «Модель» of a product row on the site tabs: the model ID as a link to its page, or a dash when there is none. */
export function ProductsModelCell({ modelId, onOpen }: ProductsModelCellProps) {
  if (modelId === null) return <Typography color="text.secondary">—</Typography>;

  return (
    <Link
      aria-label={`Відкрити модель ${modelId}`}
      component="button"
      onClick={() => onOpen(modelId)}
      type="button"
      underline="always"
    >
      {modelId}
    </Link>
  );
}

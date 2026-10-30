import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Button, Typography } from '@mui/material';

import { DetailField, DetailFieldList } from './detail-field';
import { SectionCard } from './section-card';

interface PublicAddressCardProps {
  slug: string;
  /** Public path before the slug, for example `/uk/catalog/`. */
  pathPrefix: string;
  /** Shown only to administrators. */
  onEdit?: () => void;
}

/** Public site address of a catalog item; administrators change it. */
export function PublicAddressCard({ onEdit, pathPrefix, slug }: PublicAddressCardProps) {
  return (
    <SectionCard
      action={
        onEdit ? (
          <Button onClick={onEdit} size="small" startIcon={<EditOutlinedIcon />}>
            Змінити
          </Button>
        ) : undefined
      }
      title="Адреса на сайті"
    >
      <DetailFieldList>
        <DetailField
          label="Адреса"
          value={
            <Box component="code" sx={{ fontWeight: 600 }}>
              {pathPrefix}
              {slug}
            </Box>
          }
        />
      </DetailFieldList>
      <Typography color="text.secondary" variant="body2">
        Після зміни стара адреса перенаправлятиме на нову.
      </Typography>
    </SectionCard>
  );
}

import { Box, Typography } from '@mui/material';

import { DetailField, DetailFieldList } from '../layout/detail-field';
import { SectionCard } from '../layout/section-card';

interface PublicAddressCardProps {
  slug: string;
  /** Public path before the slug, for example `/uk/catalog/`. */
  pathPrefix: string;
}

/** Read-only public site address of a catalog item; it is changed in the edit panel. */
export function PublicAddressCard({ pathPrefix, slug }: PublicAddressCardProps) {
  return (
    <SectionCard title="Адреса на сайті">
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

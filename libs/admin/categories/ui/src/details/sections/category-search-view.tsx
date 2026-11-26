import { DetailField, DetailFieldList } from '@admin/shared/ui';
import { Box, Typography } from '@mui/material';

import type { CategorySharePicture } from '@admin/categories/model';

interface CategorySearchViewProps {
  isClosedFromSearch: boolean;
  picture: CategorySharePicture | null;
}

/** «Пошук і поширення» read-only (spec 003 R-010). */
export function CategorySearchView({ isClosedFromSearch, picture }: CategorySearchViewProps) {
  return (
    <DetailFieldList columns={2}>
      <DetailField
        label="Пошукові системи"
        value={
          isClosedFromSearch
            ? 'Закрито від пошуку: Google не індексує категорію, її підкатегорії й товари'
            : 'Індексують'
        }
      />
      <DetailField
        label="Фото для поширення"
        value={
          picture?.url ? (
            <Box
              alt="Фото для поширення"
              component="img"
              src={picture.url}
              sx={{
                borderRadius: 1,
                display: 'block',
                maxHeight: 160,
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <Typography component="span" variant="body2">
              {picture ? 'Файл видалено з медіатеки.' : 'Не вибрано: сайт покаже загальне фото.'}
            </Typography>
          )
        }
      />
    </DetailFieldList>
  );
}

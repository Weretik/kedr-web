import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { Button, Popover } from '@mui/material';
import { useState } from 'react';

import { SiteModelCategoriesNav } from './site-model-categories-nav';

import type { SiteModelCategory } from '@admin/site-models/model';

interface SiteCategoryPickerProps {
  categories: readonly SiteModelCategory[];
  loading: boolean;
  selectedId: number | undefined;
  onSelect: (categoryId: number | undefined) => void;
}

/** A button with the selected category; it opens the tree of categories shown on the site. */
export function SiteCategoryPicker({
  categories,
  loading,
  onSelect,
  selectedId,
}: SiteCategoryPickerProps) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const selected = categories.find((category) => category.id === selectedId);

  return (
    <>
      <Button
        aria-haspopup="tree"
        endIcon={<ExpandMoreOutlinedIcon />}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ maxWidth: 320, justifyContent: 'space-between' }}
        variant="outlined"
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected?.name ?? 'Усі категорії'}
        </span>
      </Button>
      <Popover
        anchorEl={anchor}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        onClose={() => setAnchor(null)}
        open={anchor !== null}
        slotProps={{ paper: { sx: { maxWidth: '100%', mt: 1, width: 360 } } }}
      >
        <SiteModelCategoriesNav
          categories={categories}
          count="models"
          loading={loading}
          onSelect={(categoryId) => {
            onSelect(categoryId);
            setAnchor(null);
          }}
          selectedId={selectedId}
        />
      </Popover>
    </>
  );
}

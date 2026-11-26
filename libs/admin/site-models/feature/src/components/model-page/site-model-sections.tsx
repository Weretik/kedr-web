import { SiteModelCharacteristicsCard, SiteModelSeoSummaryCard } from '@admin/site-models/ui';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { SiteModelProductsBlock } from './site-model-products-block';

import type { useSiteModelEditor } from '../../hooks/model-editor/use-site-model-editor';
import type { EditedSiteProduct } from '../product-pane/product-attributes-panel';
import type { SiteModel } from '@admin/site-models/model';

type SiteModelSection = 'products' | 'characteristics' | 'seo';

interface SiteModelSectionsProps {
  model: SiteModel;
  editor: ReturnType<typeof useSiteModelEditor>;
  onAdd: () => void;
  onEditAttributes: (product: EditedSiteProduct) => void;
}

/** «Товари», «Характеристики» and «SEO та опис» of the model page: one tab at a time (owner, 2026-11-26). */
export function SiteModelSections({
  editor,
  model,
  onAdd,
  onEditAttributes,
}: SiteModelSectionsProps) {
  const [section, setSection] = useState<SiteModelSection>('products');
  return (
    <Stack spacing={3}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          aria-label="Розділи моделі"
          onChange={(_event, value: SiteModelSection) => setSection(value)}
          value={section}
          variant="scrollable"
        >
          <Tab label={`Товари (${model.products.length})`} value="products" />
          <Tab label="Характеристики" value="characteristics" />
          <Tab label="SEO та опис" value="seo" />
        </Tabs>
      </Box>
      {section === 'products' ? (
        <SiteModelProductsBlock
          editor={editor}
          model={model}
          onAdd={onAdd}
          onEditAttributes={onEditAttributes}
        />
      ) : null}
      {section === 'characteristics' ? (
        <SiteModelCharacteristicsCard characteristics={model.characteristics} />
      ) : null}
      {section === 'seo' ? <SiteModelSeoSummaryCard model={model} /> : null}
    </Stack>
  );
}

import { useGetAttributeOptionsQuery } from '@admin/site-models/data-access';
import {
  SiteModelAxesCard,
  SiteModelCharacteristicsCard,
  SiteModelProductsCard,
  SiteSimilarModelsCard,
} from '@admin/site-models/ui';
import { Box } from '@mui/material';

import { useAxisValueOptions } from '../../hooks/use-axis-value-options';

import type { useSiteModelEditor } from '../../hooks/use-site-model-editor';
import type { EditedSiteProduct } from '../product-attributes-panel';
import type { SiteModel, SiteShowcaseRow } from '@admin/site-models/model';

interface SiteModelProductsTabProps {
  model: SiteModel;
  editor: ReturnType<typeof useSiteModelEditor>;
  similar: readonly SiteShowcaseRow[];
  adding: boolean;
  onAdd: () => void;
  onEditAttributes: (product: EditedSiteProduct) => void;
}

/** «Товари й ознаки»: products with axis values, similar models to merge, axes, and characteristics. */
export function SiteModelProductsTab({
  adding,
  editor,
  model,
  onAdd,
  onEditAttributes,
  similar,
}: SiteModelProductsTabProps) {
  const attributeOptions = useGetAttributeOptionsQuery();
  const axisValues = useAxisValueOptions(model.axes);

  return (
    <>
      <SiteModelProductsCard
        axes={model.axes}
        axisValues={axisValues}
        busy={editor.productsBusy}
        error={editor.errors.products ?? null}
        onAdd={onAdd}
        onEditAttributes={(product) =>
          onEditAttributes({ productId: product.productId, name: product.name })
        }
        onCreateValue={editor.createValue}
        onFillFromNames={() => void editor.fillFromNames(model.id)}
        onRemove={(product) => void editor.removeProduct(model.id, product.productId)}
        onSetValue={(productId, attributeId, valueId) =>
          void editor.setValue(productId, attributeId, valueId)
        }
        products={model.products}
      />
      <SiteSimilarModelsCard
        busy={editor.adding}
        error={editor.errors.add && !adding ? editor.errors.add : null}
        models={similar}
        onMerge={(row) =>
          void editor.addProducts(
            model.id,
            row.products.map((product) => product.productId),
          )
        }
      />
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: 'minmax(0, 1fr)', xl: 'repeat(2, minmax(0, 1fr))' },
        }}
      >
        <SiteModelAxesCard
          axes={model.axes}
          busy={editor.axesBusy}
          error={editor.errors.axes ?? null}
          onChange={(attributeIds) => void editor.setAxes(model.id, attributeIds)}
          onCreateAttribute={editor.createAttribute}
          options={attributeOptions.data ?? []}
        />
        <SiteModelCharacteristicsCard characteristics={model.characteristics} />
      </Box>
    </>
  );
}

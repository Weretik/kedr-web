import { NoticeSnackbar } from '@admin/shared/ui';
import {
  readSiteModelPanel,
  siteModelPanelKey,
  writeSiteModelPanel,
} from '@admin/site-models/model';
import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { SiteModelAddProductsPanel } from './site-model-add-products-panel';
import { SiteModelEditPanel } from './site-model-edit-panel';
import { SiteModelNewPanel } from './site-model-new-panel';
import { SiteModelPanelsContext } from './site-model-panels-context';
import { SiteProductAddToModelPanel } from './site-product-add-to-model-panel';

import type { NewSiteModelOptions, SiteModelPanels } from './site-model-panels-context';
import type { SiteModelPanel } from '@admin/site-models/model';
import type { ReactNode } from 'react';

/**
 * The one place of the site model panels: any page opens them through `useSiteModelPanels`, the open panel lives in
 * `?panel=`, and the last panel stays mounted after closing so a draft survives a reopen (spec 001 R-004…R-006).
 */
export function SiteModelPanelsProvider({ children }: { children: ReactNode }) {
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const panel = readSiteModelPanel(params);
  const [shown, setShown] = useState<SiteModelPanel | undefined>(panel);
  const [newModel, setNewModel] = useState<{ options: NewSiteModelOptions; version: number }>({
    options: {},
    version: 0,
  });
  const [notice, setNotice] = useState<string | null>(null);
  if (panel && (!shown || siteModelPanelKey(panel) !== siteModelPanelKey(shown))) setShown(panel);

  const panels = useMemo<SiteModelPanels>(() => {
    const open = (next: SiteModelPanel) =>
      setParams((current) => writeSiteModelPanel(current, next));
    return {
      openEditModel: (modelId) => open({ kind: 'edit', modelId }),
      openNewModel: (options = {}) => {
        setNewModel((current) => ({ options, version: current.version + 1 }));
        open({ kind: 'new' });
      },
      openAddToModel: (target) => open({ kind: 'add', target }),
    };
  }, [setParams]);

  const isOpen = panel !== undefined;
  const close = () => setParams((current) => writeSiteModelPanel(current, undefined));
  const common = { open: isOpen, onClose: close, onNotice: setNotice };

  return (
    <SiteModelPanelsContext.Provider value={panels}>
      {children}
      {shown?.kind === 'edit' ? (
        <SiteModelEditPanel key={shown.modelId} modelId={shown.modelId} {...common} />
      ) : null}
      {shown?.kind === 'new' ? (
        <SiteModelNewPanel
          key={newModel.version}
          onClose={close}
          onCreated={(modelId, notice) =>
            navigate(`/site-models/${modelId}`, { state: { notice } })
          }
          open={isOpen}
          options={newModel.options}
        />
      ) : null}
      {shown?.kind === 'add' && 'modelId' in shown.target ? (
        <SiteModelAddProductsPanel
          key={shown.target.modelId}
          modelId={shown.target.modelId}
          {...common}
        />
      ) : null}
      {shown?.kind === 'add' && 'productId' in shown.target ? (
        <SiteProductAddToModelPanel
          key={shown.target.productId}
          onNewModel={() => {
            const productIds = 'productId' in shown.target ? [shown.target.productId] : [];
            panels.openNewModel({ productIds });
          }}
          productId={shown.target.productId}
          {...common}
        />
      ) : null}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </SiteModelPanelsContext.Provider>
  );
}

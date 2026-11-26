import { NewSiteModelPanel } from '@admin/site-models/ui';

import { useNewSiteModel } from '../../hooks/panels/use-new-site-model';

import type { NewSiteModelOptions } from './site-model-panels-context';

interface SiteModelNewPanelProps {
  options: NewSiteModelOptions;
  open: boolean;
  onClose: () => void;
  onCreated: (modelId: number) => void;
  onNotice: (text: string) => void;
}

/** «Нова модель» connected to the catalog and the create call (spec 001 R-005). */
export function SiteModelNewPanel({
  onClose,
  onCreated,
  onNotice,
  open,
  options,
}: SiteModelNewPanelProps) {
  const form = useNewSiteModel(options, onCreated, onNotice);
  return <NewSiteModelPanel {...form} onClose={onClose} open={open} />;
}

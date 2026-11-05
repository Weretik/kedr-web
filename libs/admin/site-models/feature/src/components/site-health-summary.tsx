import { useGetSiteModelHealthQuery } from '@admin/site-models/data-access';
import { Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';

import type { SiteProblemFilter } from '@admin/site-models/model';

interface Tile {
  problem: SiteProblemFilter;
  label: string;
  count: number;
  hard?: boolean;
}

/** Problem counts above «Вітрина сайту»; a tile filters the table. Tiles with nothing to fix are hidden. */
export function SiteHealthSummary({
  active,
  onSelect,
}: {
  active: SiteProblemFilter | undefined;
  onSelect: (problem: SiteProblemFilter | undefined) => void;
}) {
  const health = useGetSiteModelHealthQuery().data;
  if (!health) return null;
  const tiles: Tile[] = [
    { problem: 'no_model', label: 'Без моделі', count: health.productsWithoutModel, hard: true },
    { problem: 'no_attributes', label: 'Без ознак', count: health.productsWithoutAttributes },
    {
      problem: 'missing_axis_value',
      label: 'Не заповнена ознака',
      count: health.productsMissingAxisValue,
    },
    {
      problem: 'same_combination',
      label: 'Однакові варіанти',
      count: health.productsWithSameCombination,
    },
  ];
  const visible = tiles.filter((tile) => tile.count > 0);
  if (visible.length === 0) return null;

  return (
    <Stack direction="row" spacing={1.5} sx={{ flexWrap: 'wrap', gap: 1.5 }} useFlexGap>
      {visible.map((tile) => (
        <Card
          key={tile.problem}
          sx={{
            borderColor: active === tile.problem ? 'primary.main' : undefined,
            minWidth: 160,
          }}
          variant="outlined"
        >
          <CardActionArea
            aria-pressed={active === tile.problem}
            onClick={() => onSelect(active === tile.problem ? undefined : tile.problem)}
          >
            <CardContent>
              <Typography
                sx={{ color: tile.hard ? 'error.main' : 'warning.main', fontWeight: 700 }}
                variant="h5"
              >
                {tile.count}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {tile.label}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Stack>
  );
}

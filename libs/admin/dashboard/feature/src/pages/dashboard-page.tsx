import { appConfig } from '@admin/shared/config';
import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';

const dashboardCards = [
  {
    title: 'Catalog',
    description: 'Product and taxonomy management stays isolated inside the admin domain.',
    enabled: appConfig.features.catalog,
  },
  {
    title: 'Orders',
    description: 'A dedicated workflow surface can be added without coupling it to the storefront.',
    enabled: true,
  },
  {
    title: 'Operations',
    description: 'Shared utilities remain in shared libs, while admin-specific flows stay under admin scope.',
    enabled: true,
  },
] as const;

export function DashboardPage() {
  return (
    <Stack component="main" spacing={3}>
      <Card component="section">
        <CardContent>
          <Stack spacing={1}>
            <Typography color="primary" variant="overline">
              Admin workspace
            </Typography>
            <Typography variant="h4">{appConfig.name}</Typography>
            <Typography color="text.secondary">
              React admin is isolated from the Angular storefront and prepared for feature-based growth.
            </Typography>
            <Stack direction={{ sm: 'row' }} spacing={1}>
              <Chip label={`Version: ${appConfig.version}`} />
              <Chip label={`API: ${appConfig.apiBaseUrl || 'Not configured'}`} />
              <Chip
                color={appConfig.enableHttpLogs ? 'success' : 'default'}
                label={`Logs: ${appConfig.enableHttpLogs ? 'Enabled' : 'Disabled'}`}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Box component="section" aria-labelledby="admin-modules-title">
        <Typography id="admin-modules-title" variant="h5">
          Feature-oriented entry points
        </Typography>
        <Stack direction={{ md: 'row' }} spacing={2} sx={{ mt: 2 }}>
          {dashboardCards.map((card) => (
            <Card component="article" key={card.title} sx={{ flex: 1 }}>
              <CardContent>
                <Stack spacing={1}>
                  <Chip
                    color={card.enabled ? 'success' : 'default'}
                    label={card.enabled ? 'Ready' : 'Disabled'}
                    size="small"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  <Typography variant="h6">{card.title}</Typography>
                  <Typography color="text.secondary">{card.description}</Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

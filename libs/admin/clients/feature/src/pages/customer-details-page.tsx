import { useGetCustomerByIdQuery } from '@admin/clients/data-access';
import {
  customerPageSearch,
  isValidCustomerId,
  parseCustomerPageQuery,
} from '@admin/clients/model';
import { CustomerDetailsContent } from '@admin/clients/ui';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation, useParams, useSearchParams } from 'react-router-dom';

import type { ReactNode } from 'react';

interface CustomerDetailsPageProps {
  renderOrdersPanel: (counterpartyId: string, returnTo: string) => ReactNode;
}

export function CustomerDetailsPage({ renderOrdersPanel }: CustomerDetailsPageProps) {
  const { counterpartyId } = useParams<{ counterpartyId: string }>();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const headingReference = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingReference.current?.focus();
  }, []);
  const validId = isValidCustomerId(counterpartyId);
  const customerQuery = useGetCustomerByIdQuery(counterpartyId ?? '', { skip: !validId });
  const listUrl = `/customers${customerPageSearch(parseCustomerPageQuery(searchParams.toString()))}`;

  let content;
  if (!validId || isNotFound(customerQuery.error)) {
    content = <Alert severity="info">Клієнта не знайдено або посилання недійсне.</Alert>;
  } else if (customerQuery.isLoading || (customerQuery.isFetching && !customerQuery.data)) {
    content = (
      <Box
        aria-label="Завантаження клієнта"
        role="status"
        sx={{ display: 'flex', justifyContent: 'center', py: 8 }}
      >
        <CircularProgress />
      </Box>
    );
  } else if (customerQuery.isError) {
    content = (
      <Card variant="outlined">
        <CardContent>
          <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
            <Alert severity="error">Не вдалося завантажити клієнта.</Alert>
            <Button onClick={() => void customerQuery.refetch()} variant="outlined">
              Повторити
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  } else if (customerQuery.data) {
    content = <CustomerDetailsContent customer={customerQuery.data} />;
  } else {
    content = <Alert severity="info">Клієнта не знайдено.</Alert>;
  }

  return (
    <Stack component="section" spacing={3}>
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <MuiLink component={RouterLink} to={listUrl} underline="hover" sx={{ alignItems: 'center', display: 'inline-flex', gap: 0.75 }}>
          <ArrowBackIcon fontSize="small" />Назад до клієнтів
        </MuiLink>
        <Typography component="h1" ref={headingReference} sx={{ overflowWrap: 'anywhere' }} tabIndex={-1} variant="h4">
          Деталі клієнта
        </Typography>
      </Stack>
      {content}
      {counterpartyId && validId && customerQuery.currentData?.counterpartyId === counterpartyId && (
        renderOrdersPanel(counterpartyId, location.pathname + location.search)
      )}
    </Stack>
  );
}

export default CustomerDetailsPage;

function isNotFound(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'status' in error && error.status === 404;
}

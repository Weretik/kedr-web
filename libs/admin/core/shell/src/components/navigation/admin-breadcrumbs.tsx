import { Breadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

interface BreadcrumbSegment {
  label: string;
  to?: string;
}

const routeLabels: Record<string, string> = {
  account: 'Налаштування менеджера',
  catalog: 'Каталог товарів',
  customers: 'Клієнти',
  dashboard: 'Кабінет',
  orders: 'Замовлення',
  products: 'Каталог товарів',
};

function formatRouteSegment(segment: string) {
  return routeLabels[segment] ?? segment.replace(/-/g, ' ').replace(/^./, (character: string) => character.toUpperCase());
}

function getBreadcrumbSegments(pathname: string): BreadcrumbSegment[] {
  const routeSegments = pathname.split('/').filter(Boolean);

  if (routeSegments.length === 0 || pathname === '/dashboard') {
    return [{ label: 'Кабінет' }];
  }

  return [
    { label: 'Кабінет', to: '/dashboard' },
    ...routeSegments.map((segment, index) => ({
      label: formatRouteSegment(segment),
      to: index === routeSegments.length - 1 ? undefined : `/${routeSegments.slice(0, index + 1).join('/')}`,
    })),
  ];
}

export function AdminBreadcrumbs() {
  const { pathname } = useLocation();

  if (pathname === '/dashboard') {
    return null;
  }

  const segments = getBreadcrumbSegments(pathname);

  return (
    <Breadcrumbs aria-label="Навігаційний шлях" sx={{ mb: 2 }}>
      {segments.map((segment, index) =>
        segment.to ? (
          <Link color="inherit" component={RouterLink} key={segment.to} to={segment.to} underline="hover">
            {segment.label}
          </Link>
        ) : (
          <Typography color="text.primary" key={`${segment.label}-${index}`}>
            {segment.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
}

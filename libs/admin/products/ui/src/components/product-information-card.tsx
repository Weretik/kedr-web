import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Button, Card, CardContent, Chip, Stack, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';

import type { ProductDetails } from '@admin/products/model';

const priceFormatter = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH', maximumFractionDigits: 2 });

interface ProductInformationCardProps {
  product: ProductDetails;
  publicUrl: string | null;
  photoStorageUrl: string;
}

export function ProductInformationCard({ product, publicUrl, photoStorageUrl }: ProductInformationCardProps) {
  const details = [
    ['ID', String(product.id)],
    ['Ціна', product.price === null ? 'Не вказано' : priceFormatter.format(product.price)],
    ['Залишок', String(product.stock)],
    ['Категорія', product.categoryName || 'Не вказано'],
    ['Кількість в упаковці', String(product.quantityInPack)],
  ];

  return (
    <Card sx={{ minWidth: 0 }} variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Typography component="h2" sx={{ overflowWrap: 'anywhere' }} variant="h5">{product.nameUk}</Typography>
          <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>Російською: {product.nameRu}</Typography>
          <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
            {product.inStock && <Chip color="success" label="Наявність" size="small" />}
            {product.isSale && <Chip color="error" label="Акція" size="small" />}
            {product.isNew && <Chip color="info" label="Новинка" size="small" />}
            {product.exportToSite && <Chip color="secondary" label="На сайті" size="small" />}
          </Stack>
          <TableContainer>
            <Table aria-label="Основна інформація про товар" size="small">
              <TableBody>
                {details.map(([label, value]) => (
                  <TableRow key={label}>
                    <TableCell component="th" scope="row" sx={{ color: 'text.secondary', width: { xs: '45%', sm: '35%' } }}>{label}</TableCell>
                    <TableCell sx={{ overflowWrap: 'anywhere' }}>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={1.5}>
            {publicUrl && <Button component="a" href={publicUrl} rel="noopener noreferrer" startIcon={<OpenInNewIcon />} target="_blank" variant="contained">Відкрити на сайті</Button>}
            <Button component="a" href={photoStorageUrl} rel="noopener noreferrer" target="_blank" variant="outlined">Сховище фото</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

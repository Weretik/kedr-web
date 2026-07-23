import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import { Box, Button, Card, CardActions, CardHeader, Chip, Divider, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const orders = [
  { customer: 'Олександр Мельник', id: 'ORD-1048', status: 'В обробці', statusColor: 'warning' as const },
  { customer: 'Тетяна Коваль', id: 'ORD-1047', status: 'Виконано', statusColor: 'success' as const },
  { customer: 'Іван Петренко', id: 'ORD-1046', status: 'Скасовано', statusColor: 'error' as const },
] as const;

export function DashboardLatestOrders() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Останні замовлення" />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              <TableCell>Замовлення</TableCell>
              <TableCell>Клієнт</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow hover key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell><Chip color={order.statusColor} label={order.status} size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowForwardOutlinedIcon />} size="small">Усі замовлення</Button>
      </CardActions>
    </Card>
  );
}

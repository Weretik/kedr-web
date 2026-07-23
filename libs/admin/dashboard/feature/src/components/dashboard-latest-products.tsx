import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { Avatar, Button, Card, CardActions, CardHeader, Divider, IconButton, List, ListItem, ListItemAvatar, Stack, Typography } from '@mui/material';

const products = [
  { name: 'Мастило для деревини', updatedAt: 'Сьогодні' },
  { name: 'Захисний віск', updatedAt: 'Учора' },
  { name: 'Олія для терас', updatedAt: '12 липня' },
] as const;

export function DashboardLatestProducts() {
  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader title="Останні товари" />
      <Divider />
      <List>
        {products.map((product, index) => (
          <ListItem divider={index < products.length - 1} key={product.name} secondaryAction={<IconButton aria-label={`Дії для ${product.name}`}><MoreVertOutlinedIcon /></IconButton>}>
            <ListItemAvatar>
              <Avatar variant="rounded">{product.name.slice(0, 1)}</Avatar>
            </ListItemAvatar>
            <Stack spacing={0.25}>
              <Typography variant="subtitle1">{product.name}</Typography>
              <Typography color="text.secondary" variant="body2">Оновлено: {product.updatedAt}</Typography>
            </Stack>
          </ListItem>
        ))}
      </List>
      <Divider />
      <CardActions sx={{ justifyContent: 'flex-end' }}>
        <Button color="inherit" endIcon={<ArrowForwardOutlinedIcon />} size="small">Усі товари</Button>
      </CardActions>
    </Card>
  );
}

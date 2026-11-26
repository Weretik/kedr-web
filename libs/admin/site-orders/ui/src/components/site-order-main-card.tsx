import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import {
  formatSiteOrderMoney,
  formatSiteOrderTime,
  siteOrderNumber,
} from '@admin/site-orders/model';
import { Link } from '@mui/material';

import type { SiteOrderDetail } from '@admin/site-orders/model';

/** Who ordered and when: the main information block of the detail page. */
export function SiteOrderMainCard({ order }: { order: SiteOrderDetail }) {
  return (
    <SectionCard
      as="article"
      eyebrow="Основна інформація"
      title={order.firstName}
      titleVariant="h5"
    >
      <DetailFieldList columns={2}>
        <DetailField label="Дата" value={formatSiteOrderTime(order.placedAtUtc)} />
        <DetailField
          label="Телефон"
          value={<Link href={`tel:${order.phone.replace(/[^\d+]/g, '')}`}>{order.phone}</Link>}
        />
        <DetailField label="Сума, грн" value={formatSiteOrderMoney(order.total)} />
        <DetailField
          label="Telegram"
          value={
            order.telegramSentAtUtc
              ? `Надіслано ${formatSiteOrderTime(order.telegramSentAtUtc)}`
              : 'Ще не надіслано'
          }
        />
        <DetailField label="Номер замовлення" value={siteOrderNumber(order.orderId)} />
        {order.comment && <DetailField label="Коментар покупця" value={order.comment} />}
      </DetailFieldList>
    </SectionCard>
  );
}

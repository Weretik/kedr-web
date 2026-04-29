import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';

type OrderRow = {
  number: string;
  date: string;
  amount: string;
  status: 'new' | 'processing' | 'paid' | 'shipped';
  delivery: string;
};

type NotificationItem = {
  title: string;
  date: string;
};

@Component({
  selector: 'lib-cabinet-dashboard-page',
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    TableModule,
    TagModule,
    TimelineModule,
  ],
  templateUrl: './cabinet-dashboard.page.html',
  styleUrl: './cabinet-dashboard.page.css',
})
export class CabinetDashboardPage {
  readonly quickActions = [
    { label: 'Быстрый заказ', icon: 'pi pi-bolt' },
    { label: 'Загрузка Excel', icon: 'pi pi-file-excel' },
    { label: 'Повторить заказ', icon: 'pi pi-refresh' },
    { label: 'Запросить КП', icon: 'pi pi-file' },
  ];

  readonly summary = [
    { title: 'Тип клиента', value: 'Опт' },
    { title: 'Персональная скидка', value: '7%' },
    { title: 'Ваш менеджер', value: 'Ольга Коваль' },
  ];

  readonly orders: OrderRow[] = [
    {
      number: 'KDR-24117',
      date: '24.04.2026',
      amount: '18 420 грн',
      status: 'processing',
      delivery: 'Новая Почта',
    },
    {
      number: 'KDR-24098',
      date: '18.04.2026',
      amount: '9 860 грн',
      status: 'paid',
      delivery: 'Самовывоз',
    },
    {
      number: 'KDR-24065',
      date: '11.04.2026',
      amount: '24 100 грн',
      status: 'shipped',
      delivery: 'Новая Почта',
    },
  ];

  readonly notifications: NotificationItem[] = [
    { title: 'Заказ KDR-24117 принят в обработку', date: 'сегодня, 10:24' },
    { title: 'Добавлен счет по заказу KDR-24117', date: 'сегодня, 09:50' },
    { title: 'Заказ KDR-24098 оплачен', date: 'вчера, 16:10' },
    { title: 'Добавлена ТТН по заказу KDR-24065', date: '22.04.2026' },
  ];

  statusSeverity(
    status: OrderRow['status'],
  ): 'info' | 'warn' | 'success' | 'contrast' {
    if (status === 'new') return 'info';
    if (status === 'processing') return 'warn';
    if (status === 'paid') return 'success';
    return 'contrast';
  }

  statusLabel(status: OrderRow['status']): string {
    if (status === 'new') return 'Новый';
    if (status === 'processing') return 'В обработке';
    if (status === 'paid') return 'Оплачен';
    return 'Отправлен';
  }
}

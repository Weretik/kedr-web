import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

interface CompanyStat {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'lib-company-stats',
  imports: [NgClass],
  templateUrl: './company-stats.html',
  styleUrl: './company-stats.css',
})
export class CompanyStats {
  stats: CompanyStat[] = [
    {
      icon: 'pi pi-calendar',
      title: '15+',
      description: 'понад 15 років стабільно працюємо на ринку.',
    },
    {
      icon: 'pi pi-box',
      title: '15 000+',
      description: 'постійно підтримуємо великий асортимент товарів',
    },
    {
      icon: 'pi pi-users',
      title: '50 572+',
      description: 'нам довіряють тисячі клієнтів по всій україні.',
    },
    {
      icon: 'pi pi-map',
      title: '1 000+',
      description: 'щороку здійснюємо сотні оптових поставок.',
    },
  ];
}

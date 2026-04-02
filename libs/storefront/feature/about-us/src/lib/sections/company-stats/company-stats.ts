import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

declare const $localize: (
  messageParts: TemplateStringsArray,
  ...expressions: readonly unknown[]
) => string;

interface CompanyStat {
  icon: string;
  value: string;
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
  readonly sectionTitle = $localize`:@@about.stats.heading:Досвід та результати ClassKedr.`;
  readonly sectionDescription = $localize`:@@about.stats.subheading:Фундамент щоденної професійної діяльності, що базується на експертних знаннях та перевірених рішеннях.`;

  readonly stats: CompanyStat[] = [
    {
      icon: 'pi pi-calendar',
      value: '15+',
      title: $localize`:@@about.stats.item1.title:років стабільності`,
      description: $localize`:@@about.stats.item1.text:Тривала присутність на ринку дверної фурнітури забезпечує глибоке розуміння технічних стандартів та еволюції механізмів. Це дозволяє здійснювати професійний підбір рішень будь-якої складності.`,
    },
    {
      icon: 'pi pi-box',
      value: '15 000+',
      title: $localize`:@@about.stats.item2.title:одиниць продукції`,
      description: $localize`:@@about.stats.item2.text:Здійснюється постійне керування розширеною складською програмою. Асортимент сформований для повного задоволення запитів як на серійне виробництво дверей, так і на індивідуальну заміну фурнітури.`,
    },
    {
      icon: 'pi pi-users',
      value: '50 000+',
      title: $localize`:@@about.stats.item3.title:укомплектованих об'єктів`,
      description: $localize`:@@about.stats.item3.text:Така кількість успішних рішень свідчить про високий рівень довіри фахівців та власників нерухомості по всій Україні. Кожне замовлення супроводжується персональною відповідальністю за результат.`,
    },
    {
      icon: 'pi pi-truck',
      value: '1 000+',
      title: $localize`:@@about.stats.item4.title:проектних відвантажень щороку`,
      description: $localize`:@@about.stats.item4.text:Системна організація гуртових поставок для виробничих ліній. Налагоджена логістика та прямі комерційні зв'язки гарантують дотримання термінів і стабільну якість кожної партії.`,
    },
  ];
}

import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

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
  readonly sectionTitle = 'Досвід та результати ClassKedr.';
  readonly sectionDescription =
    'Фундамент щоденної професійної діяльності, що базується на експертних знаннях та перевірених рішеннях.';

  readonly stats: CompanyStat[] = [
    {
      icon: 'pi pi-calendar',
      value: '15+',
      title: 'років стабільності',
      description:
        'Тривала присутність на ринку дверної фурнітури забезпечує глибоке розуміння технічних стандартів та еволюції механізмів. Це дозволяє здійснювати професійний підбір рішень будь-якої складності.',
    },
    {
      icon: 'pi pi-box',
      value: '15 000+',
      title: 'одиниць продукції',
      description:
        'Здійснюється постійне керування розширеною складською програмою. Асортимент сформований для повного задоволення запитів як на серійне виробництво дверей, так і на індивідуальну заміну фурнітури.',
    },
    {
      icon: 'pi pi-users',
      value: '50 000+',
      title: "укомплектованих об'єктів",
      description:
        'Така кількість успішних рішень свідчить про високий рівень довіри фахівців та власників нерухомості по всій Україні. Кожне замовлення супроводжується персональною відповідальністю за результат.',
    },
    {
      icon: 'pi pi-truck',
      value: '1 000+',
      title: 'проектних відвантажень щороку',
      description:
        "Системна організація гуртових поставок для виробничих ліній. Налагоджена логістика та прямі комерційні зв'язки гарантують дотримання термінів і стабільну якість кожної партії.",
    },
  ];
}

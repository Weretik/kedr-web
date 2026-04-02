import { Component } from '@angular/core';

declare const $localize: (
  messageParts: TemplateStringsArray,
  ...expressions: readonly unknown[]
) => string;

type CompanyFeatureItem = {
  title: string;
  text: string;
};

type CompanyFeaturesSectionData = {
  heading: string;
  subheading: string;
  items: CompanyFeatureItem[];
};

@Component({
  selector: 'lib-company-features',
  imports: [],
  templateUrl: './company-features.html',
  styleUrl: './company-features.css',
})
export class CompanyFeatures {
  readonly companyFeaturesSectionData: CompanyFeaturesSectionData = {
    heading: $localize`:@@about.features.heading:Фурнітура ClassKedr для вашого дому.`,
    subheading: $localize`:@@about.features.subheading:Практичні та стильні рішення для дверей, які поєднують зручність у користуванні, надійність конструкцій і сучасний зовнішній вигляд`,
    items: [
      {
        title: $localize`:@@about.features.item1.title:Дверна фурнітура для дому`,
        text: $localize`:@@about.features.item1.text:ClassKedr пропонує дверну фурнітуру для квартир, будинків і офісів. Забезпечується підбір надійних рішень для щоденного використання, що відповідають високим стандартам якості.`,
      },
      {
        title: $localize`:@@about.features.item2.title:Надійність і зручність у користуванні`,
        text: $localize`:@@about.features.item2.text:Кожен виріб розрахований на тривалу експлуатацію та комфорт. Підтримується функціональність та естетичний вигляд фурнітури навіть при інтенсивному використанні протягом багатьох років.`,
      },
      {
        title: $localize`:@@about.features.item3.title:Широкий вибір та експертний підбір`,
        text: $localize`:@@about.features.item3.text:У каталозі представлені ручки, завіси та комплектуючі для різних типів дверей. Забезпечується професійна допомога у підборі рішень, що ідеально пасують до вашого інтер’єру та технічних параметрів дверного полотна.`,
      },
      {
        title: $localize`:@@about.features.item4.title:Актуальний дизайн`,
        text: $localize`:@@about.features.item4.text:Фурнітура ClassKedr доповнює сучасні інтер’єри та гармонійно поєднується з різними стилями — від класики до мінімалізму, підкреслюючи індивідуальність кожної оселі.`,
      },
      {
        title: $localize`:@@about.features.item5.title:Офіційна покупка з ПДВ`,
        text: $localize`:@@about.features.item5.text:Гарантується легальність кожної операції з наданням повного пакета документів та можливістю розрахунку з ПДВ. Прозорі фінансові умови забезпечуються для кожного клієнта.`,
      },
      {
        title: $localize`:@@about.features.item6.title:Готові рішення та складська програма`,
        text: $localize`:@@about.features.item6.text:Завдяки стабільній складській програмі, більшість позицій доступні до відвантаження. Сторона, яка здійснює продаж та супровід, оперативно підтверджує наявність та організовує доставку без зайвих затримок на виробництво.`,
      },
    ],
  };
}

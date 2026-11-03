import { render, screen, within } from '@testing-library/react';

import {
  DeliveryContact,
  DeliveryPageHeader,
  DeliveryPaymentTerms,
  ImportantTerms,
  OrderSteps,
  getDeliveryPaymentDictionary,
} from '../../index';

import type { Locale } from '@site/core/i18n';

const expected = {
  uk: {
    title: 'Доставка та оплата',
    shipping: 'Доставка',
    payment: 'Оплата',
    order: 'Як зробити замовлення?',
    important: 'Важливо знати',
    question: 'Маєте запитання?',
    call: 'Зателефонувати',
    intro:
      'Кожне замовлення індивідуальне, тому робота будується на прямому звʼязку з клієнтом. Це дозволяє підтвердити наявність і актуальну ціну перед оплатою.',
    shippingIntro: 'Відвантаження товарів по території України:',
    shippingTerms: [
      'Служба доставки: переважно «Нова Пошта».',
      'Терміни: відвантаження 1-3 робочі дні після підтвердження або оплати.',
      'Вартість: доставка оплачується покупцем за тарифами перевізника, якщо не погоджено інше.',
      'Перехід ризиків: після передачі замовлення транспортній компанії.',
      'Повернення: протягом 14 днів за умови збереження товарного вигляду та упаковки.',
    ],
    paymentIntro: 'Оплата здійснюється безготівково, що гарантує безпеку операції для обох сторін.',
    paymentTerms: [
      'Оплата за реквізитами: після підтвердження замовлення продавець надсилає офіційні реквізити (IBAN ФОП).',
      'Підтвердження: оплата вважається здійсненою після зарахування коштів на рахунок продавця.',
      'Післяплата: можлива у відділенні перевізника (уточнюйте під час підтвердження).',
    ],
    steps: [
      'Кошик: виберіть потрібні товари та додайте їх у кошик.',
      'Контакти: вкажіть номер телефону та натисніть «Оформити замовлення».',
      'Звʼязок: продавець звʼяжеться з вами в Telegram, Viber або телефоном.',
      'Уточнення: підтверджуємо наявність, актуальну ціну та деталі доставки.',
    ],
    importantTerms: [
      'Ціни на сайті інформаційні. Остаточна ціна фіксується у момент надання реквізитів.',
      'Листування в месенджерах (за номером із замовлення) є офіційною комунікацією в межах виконання угоди.',
    ],
    offer:
      '«Ці умови є частиною ПУБЛІЧНОЇ ОФЕРТИ ТА ПРАВИЛ КОРИСТУВАННЯ САЙТОМ. Здійснюючи замовлення, ви погоджуєтесь із зазначеним порядком взаємодії.»',
    offerLabel: 'ПУБЛІЧНОЇ ОФЕРТИ ТА ПРАВИЛ КОРИСТУВАННЯ САЙТОМ',
  },
  ru: {
    title: 'Доставка и оплата',
    shipping: 'Доставка',
    payment: 'Оплата',
    order: 'Как сделать заказ?',
    important: 'Важно знать',
    question: 'Есть вопросы?',
    call: 'Позвонить',
    intro:
      'Каждый заказ индивидуален, поэтому работа строится на прямой связи с клиентом. Это позволяет подтвердить наличие и актуальную цену перед оплатой.',
    shippingIntro: 'Отгрузка товаров по территории Украины:',
    shippingTerms: [
      'Служба доставки: преимущественно «Новая Почта».',
      'Сроки: отгрузка 1-3 рабочих дня после подтверждения или оплаты.',
      'Стоимость: доставку оплачивает покупатель по тарифам перевозчика, если не согласовано иное.',
      'Переход рисков: после передачи заказа транспортной компании.',
      'Возврат: в течение 14 дней при сохранении товарного вида и упаковки.',
    ],
    paymentIntro:
      'Оплата производится безналично, что гарантирует безопасность операции для обеих сторон.',
    paymentTerms: [
      'Оплата по реквизитам: после подтверждения заказа продавец отправляет официальные реквизиты (IBAN ФЛП).',
      'Подтверждение: оплата считается выполненной после зачисления средств на счет продавца.',
      'Наложенный платеж: возможен в отделении перевозчика (уточняйте при подтверждении).',
    ],
    steps: [
      'Корзина: выберите нужные товары и добавьте их в корзину.',
      'Контакты: укажите номер телефона и нажмите «Оформить заказ».',
      'Связь: продавец свяжется с вами в Telegram, Viber или по телефону.',
      'Уточнение: подтверждаем наличие, актуальную цену и детали доставки.',
    ],
    importantTerms: [
      'Цены на сайте информационные. Окончательная цена фиксируется в момент предоставления реквизитов.',
      'Переписка в мессенджерах (по номеру из заказа) является официальной коммуникацией в рамках исполнения сделки.',
    ],
    offer:
      '«Эти условия являются частью ПУБЛИЧНОЙ ОФЕРТЫ И ПРАВИЛ ПОЛЬЗОВАНИЯ САЙТОМ. Оформляя заказ, вы соглашаетесь с указанным порядком взаимодействия.»',
    offerLabel: 'ПУБЛИЧНОЙ ОФЕРТЫ И ПРАВИЛ ПОЛЬЗОВАНИЯ САЙТОМ',
  },
};

const renderContent = (locale: Locale) => {
  const dictionary = getDeliveryPaymentDictionary(locale);
  return render(
    <>
      <DeliveryPageHeader locale={locale} dictionary={dictionary} />
      <DeliveryPaymentTerms dictionary={dictionary} />
      <OrderSteps dictionary={dictionary} />
      <ImportantTerms locale={locale} dictionary={dictionary} />
      <DeliveryContact dictionary={dictionary} />
    </>,
  );
};

describe.each(['uk', 'ru'] as const)('delivery information in %s', (locale) => {
  const copy = expected[locale];

  it('renders the source introduction, exact dispatch and payment conditions', () => {
    renderContent(locale);
    expect(screen.getByRole('heading', { level: 1, name: copy.title })).toBeTruthy();
    expect(screen.getByText(copy.intro)).toBeTruthy();
    const shipping = screen.getByRole('region', { name: copy.shipping });
    const payment = screen.getByRole('region', { name: copy.payment });
    expect(within(shipping).getByText(copy.shippingIntro)).toBeTruthy();
    expect(within(payment).getByText(copy.paymentIntro)).toBeTruthy();
    for (const term of copy.shippingTerms) expect(shipping.textContent).toContain(term);
    for (const term of copy.paymentTerms) expect(payment.textContent).toContain(term);
    expect(within(shipping).getAllByRole('listitem')).toHaveLength(5);
    expect(within(payment).getAllByRole('listitem')).toHaveLength(3);
  });

  it('keeps four source order instructions in the specified order', () => {
    renderContent(locale);
    const order = screen.getByRole('region', { name: copy.order });
    const list = within(order).getByRole('list');
    expect(list.tagName).toBe('OL');
    const steps = within(list).getAllByRole('listitem');
    expect(steps).toHaveLength(4);
    copy.steps.forEach((step, index) => expect(steps[index].textContent).toContain(step));
  });

  it('preserves price, official communication, the full offer and locale-specific links', () => {
    renderContent(locale);
    const important = screen.getByRole('region', { name: copy.important });
    for (const term of copy.importantTerms) expect(within(important).getByText(term)).toBeTruthy();
    expect(important.textContent).toContain(copy.offer);
    expect(
      within(important).getByRole('link', { name: copy.offerLabel }).getAttribute('href'),
    ).toBe(`/${locale}/public-offer`);
    const contact = screen.getByRole('complementary', { name: copy.question });
    expect(within(contact).getByRole('link', { name: copy.call }).getAttribute('href')).toBe(
      'tel:+380687135049',
    );
    expect(within(contact).getByText('(068) 713-50-49')).toBeTruthy();
  });

  it('links to labelled section targets and the current-language home', () => {
    renderContent(locale);
    const navigation = screen.getByRole('navigation', {
      name: locale === 'uk' ? 'Розділи сторінки' : 'Разделы страницы',
    });
    for (const label of [copy.shipping, copy.payment, copy.order]) {
      const link = within(navigation).getByRole('link', { name: label });
      const id = screen.getByRole('region', { name: label }).id;
      expect(id).toBeTruthy();
      expect(link.getAttribute('href')).toBe(`#${id}`);
    }
    expect(
      screen
        .getByRole('link', { name: locale === 'uk' ? 'Головна' : 'Главная' })
        .getAttribute('href'),
    ).toBe(`/${locale}`);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});

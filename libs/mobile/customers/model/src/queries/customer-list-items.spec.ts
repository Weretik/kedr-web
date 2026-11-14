import {
  customerListSections,
  flattenSections,
  letterSections,
  recentCustomers,
} from './customer-list-items';

const customer = (counterpartyId: string, name: string) => ({
  counterpartyId,
  name,
  phone: null,
  email: '',
  defaultPriceTypeId: 1,
  debtKopecks: null,
  balanceKopecks: null,
});
const all = [customer('1', 'Альфа'), customer('2', 'Бета'), customer('3', 'Борей')];

describe('customer list items', () => {
  it('puts recent customers first and skips ids the device no longer knows', () => {
    const recent = recentCustomers(all, ['3', 'gone']);
    const sections = customerListSections(null, recent, letterSections(all));
    expect(sections.map((section) => section.title)).toEqual(['Недавні', 'А', 'Б']);
  });

  it('shows only the search results, or nothing when none match', () => {
    expect(customerListSections([all[0]], [], [])).toEqual([
      { data: [all[0]], key: 'found', title: 'Знайдено' },
    ]);
    expect(customerListSections([], [all[0]], letterSections(all))).toEqual([]);
  });

  it('flattens sections into headers followed by their customers', () => {
    const items = flattenSections([{ data: [all[0]], key: 'found', title: 'Знайдено' }]);
    expect(items.map((item) => item.key)).toEqual(['found', 'found:1']);
  });
});

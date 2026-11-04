import { render, screen } from '@testing-library/react';

import { FaqList } from './faq-list';

describe('FaqList', () => {
  it('keeps every answer in the HTML and opens only the first on request', () => {
    const { container } = render(
      <FaqList
        group="faq"
        items={[
          { question: 'Є опт?', answer: 'Так' },
          { question: 'Є доставка?', answer: 'Так, по Україні' },
        ]}
        openFirst
      />,
    );
    const items = [...container.querySelectorAll('details')];
    expect(items.map((item) => item.open)).toEqual([true, false]);
    expect(items.every((item) => item.getAttribute('name') === 'faq')).toBe(true);
    expect(screen.getByText('Так, по Україні')).toBeTruthy();
  });
});

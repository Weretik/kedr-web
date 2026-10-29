import { render, screen } from '@testing-library/react';

import { Button } from './button';
import { cn } from './cn';

describe('Button', () => {
  it('renders a button with the default variant', () => {
    render(<Button>Каталог</Button>);

    expect(screen.getByRole('button', { name: 'Каталог' }).className).toContain('bg-primary');
  });

  it('passes styles to a child link with asChild', () => {
    render(
      <Button asChild variant="outline">
        <a href="/uk/wholesale">Співпраця</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Співпраця' });
    expect(link.getAttribute('href')).toBe('/uk/wholesale');
    expect(link.className).toContain('border');
  });
});

describe('cn', () => {
  it('lets later utilities win', () => {
    expect(cn('px-2 text-sm', false, 'px-4')).toBe('text-sm px-4');
  });
});

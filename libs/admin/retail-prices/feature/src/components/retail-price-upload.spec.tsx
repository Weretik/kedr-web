import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RetailPriceUpload } from './retail-price-upload';

const props = {
  busy: false,
  file: null,
  onChooseFile: vi.fn(),
  onProtectChange: vi.fn(),
  onUpload: vi.fn(),
  priceTypeName: 'Розница халтмаг 30%',
  protectFromOneC: true,
  uploading: false,
};

describe('RetailPriceUpload', () => {
  it('cannot upload without a file and names the columns the file needs', () => {
    render(<RetailPriceUpload {...props} />);

    expect(screen.getByRole('button', { name: 'Завантажити' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByText(/«Код» і «Розница халтмаг 30%»/)).toBeTruthy();
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(true);
  });

  it('passes the chosen file, the flag and the upload', () => {
    const onChooseFile = vi.fn();
    const onProtectChange = vi.fn();
    const onUpload = vi.fn();
    const file = new File(['x'], 'Цены_26.11.xlsx');
    render(
      <RetailPriceUpload
        {...props}
        file={file}
        onChooseFile={onChooseFile}
        onProtectChange={onProtectChange}
        onUpload={onUpload}
      />,
    );

    fireEvent.change(screen.getByLabelText('Файл з цінами'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Завантажити' }));

    expect(onChooseFile).toHaveBeenCalledWith(file);
    expect(onProtectChange).toHaveBeenCalledWith(false);
    expect(onUpload).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Цены_26.11.xlsx')).toBeTruthy();
  });
});

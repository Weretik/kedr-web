import { folderNameIssue, uploadIssue } from './media-rules';

describe('media rules', () => {
  it('accepts pictures up to 15 MB and names the rejected file', () => {
    expect(uploadIssue({ name: 'a.jpg', size: 10, type: 'image/jpeg' })).toBeNull();
    expect(uploadIssue({ name: 'a.pdf', size: 10, type: 'application/pdf' })).toContain('«a.pdf»');
    expect(uploadIssue({ name: 'big.png', size: 16 * 1024 * 1024, type: 'image/png' })).toContain(
      '15 МБ',
    );
  });

  it('requires a folder name of at most 100 characters', () => {
    expect(folderNameIssue('  ')).not.toBeNull();
    expect(folderNameIssue('x'.repeat(101))).not.toBeNull();
    expect(folderNameIssue('Схеми')).toBeNull();
  });
});

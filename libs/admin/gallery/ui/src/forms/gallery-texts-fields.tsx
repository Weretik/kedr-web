import { galleryCaptionMaxLength, galleryTitleMaxLength } from '@admin/gallery/model';
import { CountedTextField } from '@admin/shared/ui';
import { Box, Typography } from '@mui/material';

import type { GalleryTexts } from '@admin/gallery/model';

interface GalleryTextsFieldsProps {
  texts: GalleryTexts;
  issues: Partial<Record<keyof GalleryTexts, string>>;
  onChange: (texts: GalleryTexts) => void;
}

const languages = [
  { label: 'Українською', title: 'titleUk', caption: 'captionUk' },
  { label: 'Російською', title: 'titleRu', caption: 'captionRu' },
] as const;

/** Title and caption side by side for both site languages; all four are optional. */
export function GalleryTextsFields({ issues, onChange, texts }: GalleryTextsFieldsProps) {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
      {languages.map((language) => (
        <Box key={language.label} sx={{ display: 'grid', gap: 2, alignContent: 'start' }}>
          <Typography color="text.secondary" variant="overline">
            {language.label}
          </Typography>
          <CountedTextField
            error={issues[language.title]}
            label="Назва"
            maxLength={galleryTitleMaxLength}
            onChange={(value) => onChange({ ...texts, [language.title]: value })}
            value={texts[language.title]}
          />
          <CountedTextField
            error={issues[language.caption]}
            hint="Необов’язково"
            label="Підпис"
            maxLength={galleryCaptionMaxLength}
            multiline
            onChange={(value) => onChange({ ...texts, [language.caption]: value })}
            value={texts[language.caption]}
          />
        </Box>
      ))}
    </Box>
  );
}

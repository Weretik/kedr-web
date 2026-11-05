import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { Box, Stack, Typography } from '@mui/material';

/**
 * The panel repeats the dark sidebar of the signed-in admin (core/shell sidebar colors); core libs
 * may not import each other, so the few values it needs live here.
 */
const sidebarColors = {
  background: '#141713',
  text: '#A9B0A5',
  textStrong: '#EEF0EA',
  activeBackground: 'rgba(63, 164, 53, 0.2)',
  activeText: '#8FD684',
  accent: '#3FA435',
} as const;

const features = [
  { icon: ReceiptLongOutlinedIcon, label: 'Замовлення, клієнти й ціни з 1С' },
  { icon: CategoryOutlinedIcon, label: 'Каталог, фото та медіатека' },
  { icon: ArticleOutlinedIcon, label: 'Тексти й SEO сайту' },
] as const;

/** The dark left side of the login page: where you are signing in and what is inside. */
export function LoginIntroPanel() {
  return (
    <Box
      aria-label="Про Кедр Офіс"
      component="section"
      sx={{
        bgcolor: sidebarColors.background,
        color: sidebarColors.textStrong,
        display: { xs: 'none', md: 'flex' },
        flex: 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        px: 8,
        py: 7,
        width: { md: 440, lg: 560 },
      }}
    >
      <Box
        alt="Class Kedr"
        component="img"
        src="/assets/logo/main-logo-on-dark.svg"
        sx={{ display: 'block', height: 44, width: 'auto' }}
      />
      <Stack spacing={2.5}>
        <Typography
          sx={{
            color: sidebarColors.accent,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
          }}
        >
          CLASS KEDR · ДВЕРНА ФУРНІТУРА
        </Typography>
        <Typography component="p" sx={{ fontSize: 44, fontWeight: 800, lineHeight: 1.1 }}>
          Кедр Офіс
        </Typography>
        <Typography
          sx={{ color: sidebarColors.text, fontSize: 18, lineHeight: 1.5, maxWidth: 400 }}
        >
          Робочий кабінет команди Class Kedr: дверна фурнітура оптом і в роздріб.
        </Typography>
        <Stack component="ul" spacing={1.75} sx={{ listStyle: 'none', m: 0, mt: 1.5, p: 0 }}>
          {features.map(({ icon: Icon, label }) => (
            <Stack
              component="li"
              direction="row"
              key={label}
              spacing={1.5}
              sx={{ alignItems: 'center' }}
            >
              <Box
                sx={{
                  alignItems: 'center',
                  bgcolor: sidebarColors.activeBackground,
                  borderRadius: 2,
                  display: 'flex',
                  height: 32,
                  justifyContent: 'center',
                  width: 32,
                }}
              >
                <Icon aria-hidden fontSize="small" sx={{ color: sidebarColors.activeText }} />
              </Box>
              <Typography sx={{ fontSize: 15 }}>{label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
      <Typography sx={{ color: sidebarColors.text, fontSize: 13 }}>
        Харків · kedr.class19@gmail.com
      </Typography>
    </Box>
  );
}

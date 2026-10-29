import { JetBrains_Mono, Onest } from 'next/font/google';

/** Onest for the interface, JetBrains Mono only for SKUs; both self-hosted by next/font. */
export const onest = Onest({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-onest',
  display: 'swap',
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

import type { Shadows } from '@mui/material/styles';

const ink = (alpha: number) => `rgba(15, 17, 15, ${alpha})`;

/** Soft two-layer shadows: a tight contact shadow plus a wide ambient one. */
export const adminShadows = [
  'none',
  `0px 1px 2px ${ink(0.05)}, 0px 4px 16px ${ink(0.04)}`,
  `0px 1px 2px ${ink(0.06)}, 0px 6px 20px ${ink(0.05)}`,
  `0px 2px 4px ${ink(0.06)}, 0px 8px 24px ${ink(0.06)}`,
  `0px 2px 6px ${ink(0.07)}, 0px 10px 28px ${ink(0.07)}`,
  `0px 3px 8px ${ink(0.07)}, 0px 12px 32px ${ink(0.08)}`,
  `0px 3px 10px ${ink(0.08)}, 0px 14px 36px ${ink(0.08)}`,
  `0px 4px 12px ${ink(0.08)}, 0px 16px 40px ${ink(0.09)}`,
  `0px 4px 14px ${ink(0.08)}, 0px 18px 44px ${ink(0.09)}`,
  `0px 5px 16px ${ink(0.09)}, 0px 20px 48px ${ink(0.1)}`,
  `0px 5px 18px ${ink(0.09)}, 0px 22px 52px ${ink(0.1)}`,
  `0px 6px 20px ${ink(0.09)}, 0px 24px 56px ${ink(0.1)}`,
  `0px 6px 22px ${ink(0.1)}, 0px 26px 60px ${ink(0.11)}`,
  `0px 7px 24px ${ink(0.1)}, 0px 28px 64px ${ink(0.11)}`,
  `0px 7px 26px ${ink(0.1)}, 0px 30px 68px ${ink(0.11)}`,
  `0px 8px 28px ${ink(0.1)}, 0px 32px 72px ${ink(0.12)}`,
  `0px 8px 30px ${ink(0.11)}, 0px 34px 76px ${ink(0.12)}`,
  `0px 9px 32px ${ink(0.11)}, 0px 36px 80px ${ink(0.12)}`,
  `0px 9px 34px ${ink(0.11)}, 0px 38px 84px ${ink(0.13)}`,
  `0px 10px 36px ${ink(0.12)}, 0px 40px 88px ${ink(0.13)}`,
  `0px 10px 38px ${ink(0.12)}, 0px 42px 92px ${ink(0.13)}`,
  `0px 11px 40px ${ink(0.12)}, 0px 44px 96px ${ink(0.14)}`,
  `0px 11px 42px ${ink(0.13)}, 0px 46px 100px ${ink(0.14)}`,
  `0px 12px 44px ${ink(0.13)}, 0px 48px 104px ${ink(0.14)}`,
  `0px 12px 46px ${ink(0.13)}, 0px 50px 108px ${ink(0.15)}`,
] satisfies Shadows;

import type { Locale } from '@site/core/i18n';

/** Public company facts selected and localized by the feature, without an API dependency. */
export interface ContactsDetails {
  phone: { display: string; e164: string };
  email: string;
  city: string;
  telegram: string;
  viber: string;
  map: string;
}

export interface ContactsDictionary {
  locale: Locale;
  home: string;
  breadcrumbLabel: string;
  title: string;
  intro: string;
  navigationLabel: string;
  channelsLabel: string;
  connectLink: string;
  locationLink: string;
  wholesaleLink: string;
  salesTitle: string;
  phoneCaption: string;
  call: string;
  copyLabel: string;
  copiedLabel: string;
  copyFallbackLabel: string;
  writeTitle: string;
  telegramCaption: string;
  viberCaption: string;
  emailLabel: string;
  locationTitle: string;
  openMap: string;
  visitTitle: string;
  visitText: string;
  contactManager: string;
  wholesaleTitle: string;
  wholesaleText: string;
  writeManager: string;
  prepareTitle: string;
  prepareText: string;
  helpLabel: string;
  deliveryLink: string;
  returnsLink: string;
}

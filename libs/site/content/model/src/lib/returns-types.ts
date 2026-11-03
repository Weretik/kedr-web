import type { Locale } from '@site/core/i18n';

export interface ReturnsRow {
  term: string;
  text: string;
}

export interface ReturnsPolicySection {
  title: string;
  intro?: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
  sections?: readonly ReturnsPolicySection[];
}

export interface ReturnsDictionary {
  locale: Locale;
  home: string;
  breadcrumbLabel: string;
  title: string;
  intro: string;
  navigationLabel: string;
  conditionsTitle: string;
  conditions: readonly ReturnsRow[];
  warrantyTitle: string;
  warrantyLink: string;
  warranty: readonly ReturnsRow[];
  processTitle: string;
  processLink: string;
  steps: readonly { title: string; text: string }[];
  importantTitle: string;
  notes: readonly string[];
  fullRulesLink: string;
  helpTitle: string;
  call: string;
  policyTitle: string;
  policyLead: string;
  policy: readonly ReturnsPolicySection[];
  faqTitle: string;
  questions: readonly { title: string; text: string }[];
}

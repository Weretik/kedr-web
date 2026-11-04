import { formatUaPhone, viberChatLink } from '@site/core/config';

import type { components } from '@shared/api-contracts';
import type { CompanyContacts } from '@site/core/config';

type CompanyContactsDto = components['schemas']['CompanyContacts'];

/** API row to the site model: display phone and Viber link are derived here, not stored. */
export function mapCompanyContacts(dto: CompanyContactsDto): CompanyContacts {
  return {
    phone: { display: formatUaPhone(dto.salesPhone), e164: dto.salesPhone },
    email: dto.email,
    city: { uk: dto.cityUk, ru: dto.cityRu },
    links: { telegram: dto.telegramUrl, viber: viberChatLink(dto.viberPhone), map: dto.mapUrl },
  };
}

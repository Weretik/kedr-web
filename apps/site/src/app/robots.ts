import { buildRobotsFile } from '@site/core/seo';

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return buildRobotsFile();
}

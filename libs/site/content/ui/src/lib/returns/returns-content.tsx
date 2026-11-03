import { ReturnsFaq } from './returns-faq';
import { ReturnsHeader } from './returns-header';
import { ReturnsPanels } from './returns-panels';
import { ReturnsPolicy } from './returns-policy';
import { ReturnsProcess } from './returns-process';
import { ReturnsSupport } from './returns-support';

import type { ReturnsDictionary } from '@site/content/model';

export function ReturnsContent({ dictionary }: { dictionary: ReturnsDictionary }) {
  return (
    <div className="space-y-7 py-5 sm:py-8 lg:space-y-8 lg:py-10">
      <ReturnsHeader dictionary={dictionary} />
      <ReturnsPanels dictionary={dictionary} />
      <ReturnsProcess dictionary={dictionary} />
      <ReturnsSupport dictionary={dictionary} />
      <ReturnsPolicy dictionary={dictionary} />
      <ReturnsFaq dictionary={dictionary} />
    </div>
  );
}

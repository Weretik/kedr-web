import { useMediaPicker } from '@admin/media/data-access';

import type { MediaFile } from '@admin/media/model';

/** The «Медіа» picker for a decor texture; files load only while it is open. */
export const useTexturePicker = (onPicked: (file: MediaFile) => void) => useMediaPicker(onPicked);

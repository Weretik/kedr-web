import { launchImageLibraryAsync } from 'expo-image-picker';

import type { PickedPhoto } from './profile-api';

/**
 * Opens the gallery with a square crop; JPEG at 70 % keeps a phone photo well under the 2 MB limit. Null when the
 * manager cancels.
 */
export async function pickSquarePhoto(): Promise<PickedPhoto | null> {
  const result = await launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [1, 1],
    mediaTypes: ['images'],
    quality: 0.7,
  });
  const asset = result.canceled ? null : result.assets[0];
  if (!asset) return null;
  const mimeType = asset.mimeType ?? 'image/jpeg';
  return {
    fileName: asset.fileName ?? `avatar.${mimeType.split('/')[1] ?? 'jpg'}`,
    mimeType,
    uri: asset.uri,
  };
}

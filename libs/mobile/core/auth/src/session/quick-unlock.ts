import * as LocalAuthentication from 'expo-local-authentication';

/** True when the device has a fingerprint, face or device code set up. */
export async function isQuickUnlockAvailable(): Promise<boolean> {
  try {
    const [hasHardware, enrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);
    return hasHardware && enrolled;
  } catch {
    return false;
  }
}

export async function confirmOwner(): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      cancelLabel: 'Скасувати',
      fallbackLabel: 'Код пристрою',
      promptMessage: 'Розблокувати Кедр Менеджер',
    });
    return result.success;
  } catch {
    return false;
  }
}

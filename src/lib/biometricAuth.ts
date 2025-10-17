import { Capacitor } from '@capacitor/core';

export interface BiometricAuth {
  isAvailable(): Promise<boolean>;
  authenticate(reason: string): Promise<boolean>;
  supportsCredentials(): boolean;
}

class WebBiometricAuth implements BiometricAuth {
  async isAvailable(): Promise<boolean> {
    if (!window.PublicKeyCredential) {
      return false;
    }

    try {
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch {
      return false;
    }
  }

  async authenticate(reason: string): Promise<boolean> {
    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          userVerification: 'required',
          timeout: 60000,
        },
      } as any);

      return !!credential;
    } catch {
      return false;
    }
  }

  supportsCredentials(): boolean {
    return !!window.PublicKeyCredential;
  }
}

class NativeBiometricAuth implements BiometricAuth {
  async isAvailable(): Promise<boolean> {
    console.log('Biometric check - native platform');
    return false;
  }

  async authenticate(reason: string): Promise<boolean> {
    console.log('Biometric auth - native platform:', reason);
    return false;
  }

  supportsCredentials(): boolean {
    return true;
  }
}

export const biometricAuth: BiometricAuth = Capacitor.isNativePlatform()
  ? new NativeBiometricAuth()
  : new WebBiometricAuth();

export async function saveBiometricCredential(userId: string): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  console.log('Save biometric credential (native):', userId);
}

export async function getBiometricCredential(): Promise<string | null> {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  console.log('Get biometric credential (native)');
  return null;
}

export async function deleteBiometricCredential(): Promise<void> {
  if (!Capacitor.isNativePlatform()) {
    return;
  }

  console.log('Delete biometric credential (native)');
}

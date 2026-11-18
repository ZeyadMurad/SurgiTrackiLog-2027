// ============================================================================
// BiometricAuth.tsx — WebAuthn API for Touch ID / Fingerprint / Face ID login
// ----------------------------------------------------------------------------
// Uses the Web Authentication API (WebAuthn) — supported on:
//   - Android: Chrome 67+ with fingerprint
//   - iOS Safari 13+ with Touch ID / Face ID
//   - macOS Chrome/Safari with Touch ID
//   - Windows 10+ with Windows Hello (fingerprint, PIN, face)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Fingerprint, Lock, X, Check, AlertTriangle, Loader } from 'lucide-react';

const I18N = {
  en: {
    title: 'Biometric Login',
    subtitle: 'Sign in with Touch ID, Face ID, or Fingerprint',
    enable: 'Enable Biometric Login',
    login: 'Sign in with Biometric',
    enabled: 'Biometric Login Enabled',
    scan: 'Place your finger on the sensor or look at the camera',
    scanning: 'Scanning...',
    success: 'Authentication successful!',
    failed: 'Authentication failed. Try again.',
    notSupported: 'Biometric authentication is not supported on this device.',
    disable: 'Disable Biometric Login',
    lastUsed: 'Last used',
  },
  ar: {
    title: 'الدخول البيومتري',
    subtitle: 'سجّل الدخول بـ Touch ID أو Face ID أو البصمة',
    enable: 'تفعيل الدخول البيومتري',
    login: 'الدخول بالبيومتري',
    enabled: 'تم تفعيل الدخول البيومتري',
    scan: 'ضع إصبعك على المستشعر أو انظر للكاميرا',
    scanning: 'جارٍ المسح...',
    success: 'تم التحقق بنجاح!',
    failed: 'فشل التحقق. حاول مرة أخرى.',
    notSupported: 'الدخول البيومتري غير مدعوم على هذا الجهاز.',
    disable: 'تعطيل الدخول البيومتري',
    lastUsed: 'آخر استخدام',
  },
  de: {
    title: 'Biometrische Anmeldung',
    subtitle: 'Mit Touch ID, Face ID oder Fingerabdruck verifizieren',
    enable: 'Biometrie aktivieren',
    login: 'Mit Biometrie verifizieren',
    enabled: 'Biometrische Anmeldung aktiv',
    scan: 'Finger auf den Sensor legen oder in die Kamera schauen',
    scanning: 'Wird gescannt...',
    success: 'Verifizierung erfolgreich!',
    failed: 'Verifizierung fehlgeschlagen. Erneut versuchen.',
    notSupported: 'Biometrische Authentifizierung wird auf diesem Gerät nicht unterstützt.',
    disable: 'Biometrie deaktivieren',
    lastUsed: 'Zuletzt verwendet',
  },
} as const;

type Lang = keyof typeof I18N;

// ============================================================================
// Check if WebAuthn is supported
// ============================================================================
function isBiometricSupported(): boolean {
  return typeof window !== 'undefined' &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function';
}

async function checkBiometricAvailable(): Promise<boolean> {
  if (!isBiometricSupported()) return false;
  try {
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

// ============================================================================
// Generate a random challenge (32 bytes, base64url)
// ============================================================================
function generateChallenge(): ArrayBuffer {
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  return challenge.buffer;
}

// ============================================================================
// Generate a random user ID (16 bytes)
// ============================================================================
function generateUserId(): ArrayBuffer {
  const id = new Uint8Array(16);
  crypto.getRandomValues(id);
  return id.buffer;
}

// ============================================================================
// Encode ArrayBuffer to base64url string (for storage)
// ============================================================================
function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (let i = 0; i < bytes.length; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ============================================================================
// Decode base64url string to ArrayBuffer
// ============================================================================
function base64UrlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
  const binary = atob(base64 + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// ============================================================================
// Component
// ============================================================================
interface BiometricAuthProps {
  language: Lang;
  userEmail: string;
  onBiometricSuccess?: () => void;
}

export const BiometricAuth: React.FC<BiometricAuthProps> = ({ language, userEmail, onBiometricSuccess }) => {
  const t = I18N[language] || I18N.en;
  const isRtl = language === 'ar';
  const [supported, setSupported] = useState(false);
  const [available, setAvailable] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'scanning'>('idle');
  const [lastUsed, setLastUsed] = useState<string | null>(null);

  // Storage key (per-user)
  const cleanEmail = (userEmail || 'default').toLowerCase().trim();
  const storageKey = `surgitrack_biometric_${cleanEmail}`;

  // Check support on mount
  useEffect(() => {
    const check = async () => {
      const sup = isBiometricSupported();
      setSupported(sup);
      if (sup) {
        const avail = await checkBiometricAvailable();
        setAvailable(avail);
      }
      // Check if biometric is already enabled
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          setIsEnabled(true);
          setLastUsed(data.lastUsed || null);
        } catch {}
      }
    };
    check();
  }, [storageKey]);

  // ============================================================================
  // Enable biometric registration
  // ============================================================================
  const enableBiometric = async () => {
    if (!available) return;
    setIsScanning(true);
    setStatus('scanning');
    try {
      const publicKey: PublicKeyCredentialCreationOptions = {
        challenge: generateChallenge(),
        rp: {
          name: 'SurgiTrack iLog PRO',
          id: window.location.hostname,
        },
        user: {
          id: generateUserId(),
          name: cleanEmail,
          displayName: cleanEmail,
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },   // ES256
          { type: 'public-key', alg: -257 }, // RS256
        ],
        timeout: 60000,
        attestation: 'none',
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
      };

      const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential;
      if (!credential) throw new Error('No credential returned');

      // Store credential info (we don't need the actual key — the browser handles that)
      const credentialId = bufferToBase64Url(credential.rawId);
      localStorage.setItem(storageKey, JSON.stringify({
        credentialId,
        enabledAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
      }));

      localStorage.setItem('surgitrack_biometric_last_email', cleanEmail);
      setIsEnabled(true);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (e: any) {
      console.error('Biometric registration failed:', e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setIsScanning(false);
    }
  };

  // ============================================================================
  // Login with biometric (authentication)
  // ============================================================================
  const loginWithBiometric = async () => {
    if (!isEnabled) return;
    const stored = localStorage.getItem(storageKey);
    if (!stored) return;
    let credentialId: string;
    try {
      const data = JSON.parse(stored);
      credentialId = data.credentialId;
    } catch {
      return;
    }

    setIsScanning(true);
    setStatus('scanning');
    try {
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: generateChallenge(),
        timeout: 60000,
        rpId: window.location.hostname,
        allowCredentials: [{
          type: 'public-key',
          id: base64UrlToBuffer(credentialId),
          transports: ['internal'],
        }],
        userVerification: 'required',
      };

      const assertion = await navigator.credentials.get({ publicKey }) as PublicKeyCredential;
      if (!assertion) throw new Error('Authentication failed');

      // Update lastUsed
      const now = new Date().toISOString();
      setLastUsed(now);
      localStorage.setItem(storageKey, JSON.stringify({
        credentialId,
        enabledAt: JSON.parse(stored).enabledAt,
        lastUsed: now,
      }));

      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
        onBiometricSuccess?.();
      }, 1000);
    } catch (e: any) {
      console.error('Biometric authentication failed:', e);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } finally {
      setIsScanning(false);
    }
  };

  // ============================================================================
  // Disable biometric
  // ============================================================================
  const disableBiometric = () => {
    localStorage.removeItem(storageKey);
    setIsEnabled(false);
    setLastUsed(null);
    setStatus('idle');
  };

  // ============================================================================
  // Render
  // ============================================================================
  if (!supported || !available) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} style={{
        padding: '1rem',
        background: 'rgba(100, 116, 139, 0.1)',
        border: '1px solid rgba(100, 116, 139, 0.3)',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <AlertTriangle size={20} color="#64748b" style={{ margin: '0 auto 0.5rem' }} />
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>{t.notSupported}</p>
      </div>
    );
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{
        padding: '1.25rem',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        border: '1px solid #334155',
        borderRadius: '12px',
        textAlign: 'center',
      }}
    >
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: isEnabled ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
        boxShadow: isEnabled ? '0 0 24px rgba(16, 185, 129, 0.5)' : '0 0 24px rgba(124, 58, 237, 0.5)',
      }}>
        {isScanning ? <Loader size={28} color="white" className="animate-spin" /> :
         status === 'success' ? <Check size={28} color="white" /> :
         status === 'error' ? <X size={28} color="white" /> :
         <Fingerprint size={28} color="white" />}
      </div>

      <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem 0' }}>
        {t.title}
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.8125rem', margin: '0 0 1rem 0' }}>
        {isEnabled ? t.enabled : t.subtitle}
      </p>

      {status === 'scanning' && (
        <p style={{ color: '#c4b5fd', fontSize: '0.85rem', marginBottom: '1rem' }}>
          {t.scan}
        </p>
      )}
      {status === 'success' && (
        <p style={{ color: '#4ade80', fontSize: '0.85rem', marginBottom: '1rem' }}>
          ✓ {t.success}
        </p>
      )}
      {status === 'error' && (
        <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>
          ✗ {t.failed}
        </p>
      )}

      {!isEnabled ? (
        <button
          onClick={enableBiometric}
          disabled={isScanning}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isScanning ? 'wait' : 'pointer',
            fontSize: '0.95rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <Fingerprint size={18} />
          {t.enable}
        </button>
      ) : (
        <>
          <button
            onClick={loginWithBiometric}
            disabled={isScanning}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: isScanning ? 'wait' : 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <Fingerprint size={18} />
            {t.login}
          </button>
          <button
            onClick={disableBiometric}
            style={{
              width: '100%',
              padding: '0.5rem',
              background: 'transparent',
              color: '#94a3b8',
              border: '1px solid #475569',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 500,
            }}
          >
            {t.disable}
          </button>
        </>
      )}

      {lastUsed && (
        <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.75rem' }}>
          {t.lastUsed}: {new Date(lastUsed).toLocaleString(language === 'ar' ? 'ar' : 'en')}
        </p>
      )}
    </div>
  );
};

export default BiometricAuth;

import { useState, useEffect } from 'react';

/**
 * PWAInstallBanner
 * Shows a native-feeling "Add to Home Screen" prompt on Android (Chrome)
 * and a manual instruction nudge on iOS (Safari doesn't support beforeinstallprompt).
 */
export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    // Don't show if dismissed this session
    if (sessionStorage.getItem('pwa-banner-dismissed')) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(ios);

    if (ios) {
      // Show iOS nudge after 3s
      const t = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(t);
    }

    // Android/Chrome: listen for install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('pwa-banner-dismissed', '1');
  };

  if (!show || dismissed) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 99999,
      padding: '12px 16px',
      background: 'linear-gradient(135deg, #1a0f07, #2c1a0e)',
      borderTop: '1px solid rgba(255,107,0,0.3)',
      boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      animation: 'slideUp 0.4s ease',
    }}>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* App icon */}
      <img
        src="/icons/icon-192.png"
        alt="DevSetu"
        style={{ width: 48, height: 48, borderRadius: 12, flexShrink: 0 }}
        onError={e => { e.target.style.display = 'none'; }}
      />

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 900, color: '#F0C040', fontSize: 14, fontFamily: 'Cinzel, serif' }}>
          📱 Install DevSetu App
        </div>
        {isIOS ? (
          <div style={{ color: 'rgba(255,248,240,0.6)', fontSize: 12, marginTop: 2, lineHeight: 1.4 }}>
            Tap <strong style={{ color: '#FF6B00' }}>Share ↑</strong> then <strong style={{ color: '#FF6B00' }}>"Add to Home Screen"</strong> for the full app experience
          </div>
        ) : (
          <div style={{ color: 'rgba(255,248,240,0.6)', fontSize: 12, marginTop: 2 }}>
            Book pandits, get Muhurtas & samagri — all offline ready
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,248,240,0.2)',
            color: 'rgba(255,248,240,0.5)',
            borderRadius: 20,
            padding: '7px 14px',
            fontSize: 12,
            cursor: 'pointer',
          }}
        >
          Later
        </button>
        {!isIOS && (
          <button
            onClick={handleInstall}
            style={{
              background: 'linear-gradient(135deg, #FF6B00, #D4A017)',
              border: 'none',
              color: '#fff',
              borderRadius: 20,
              padding: '7px 18px',
              fontSize: 12,
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Install ↓
          </button>
        )}
      </div>
    </div>
  );
}

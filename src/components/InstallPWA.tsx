import React, { useEffect, useState } from 'react';
import { Download, X, Smartphone, Monitor, Share2, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function isInStandaloneMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

function getDismissedTime() {
  const t = localStorage.getItem('pwa-dismissed');
  return t ? parseInt(t) : 0;
}

export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Already installed as app
    if (isInStandaloneMode()) { setInstalled(true); return; }

    // Don't show if dismissed recently (24 hours)
    const dismissed = getDismissedTime();
    if (Date.now() - dismissed < 1000 * 60 * 60 * 24) return;

    const ios = isIOS();
    setIsIOSDevice(ios);

    if (ios) {
      // iOS: show manual install instructions after delay
      const t = setTimeout(() => setShowBanner(true), 4000);
      return () => clearTimeout(t);
    }

    // Android/Desktop: listen for native install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setShowBanner(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-dismissed', Date.now().toString());
  };

  if (!showBanner || installed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'min(420px, calc(100vw - 24px))',
        background: 'linear-gradient(135deg, rgba(10,10,20,0.98) 0%, rgba(25,15,55,0.98) 100%)',
        border: '1px solid rgba(99,102,241,0.35)',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(99,102,241,0.1), 0 4px 24px rgba(99,102,241,0.25)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        animation: 'pwaSlideUp 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      }}
    >
      <style>{`
        @keyframes pwaSlideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .pwa-install-btn { transition: all 0.2s; }
        .pwa-install-btn:hover { filter: brightness(1.1); transform: scale(1.02); }
        .pwa-dismiss-btn { transition: all 0.2s; }
        .pwa-dismiss-btn:hover { background: rgba(255,255,255,0.1) !important; }
        .pwa-step { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; }
        .pwa-step-num {
          min-width: 22px; height: 22px;
          background: rgba(99,102,241,0.25);
          border: 1px solid rgba(99,102,241,0.4);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #818cf8;
          margin-top: 1px;
        }
        .pwa-step-text { font-size: 13px; color: rgba(255,255,255,0.65); line-height: 1.45; }
        .pwa-step-icon {
          display: inline-flex; align-items: center; gap: 4px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 6px; padding: 2px 6px;
          font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.7);
          vertical-align: middle; margin: 0 2px;
        }
      `}</style>

      {/* Close */}
      <button
        onClick={handleDismiss}
        className="pwa-dismiss-btn"
        aria-label="Dismiss install banner"
        style={{
          position: 'absolute', top: '12px', right: '12px',
          background: 'rgba(255,255,255,0.05)', border: 'none',
          borderRadius: '50%', width: '28px', height: '28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: 'rgba(255,255,255,0.4)',
        }}
      >
        <X size={13} />
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '14px', flexShrink: 0,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', boxShadow: '0 4px 16px rgba(99,102,241,0.45)',
        }}>🧠</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '15px', color: '#fff', letterSpacing: '-0.2px' }}>
            Install AInterview
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>
            {isIOSDevice ? 'Add to your iPhone home screen' : 'Add to your device — works offline'}
          </div>
        </div>
      </div>

      {/* Feature pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {[
          { icon: <Smartphone size={11} />, text: 'Works offline' },
          { icon: <Monitor size={11} />, text: 'Phone & desktop' },
          { icon: <Download size={11} />, text: 'No app store' },
        ].map(({ icon, text }) => (
          <div key={text} style={{
            display: 'flex', alignItems: 'center', gap: '4px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '20px', padding: '4px 9px',
            fontSize: '11px', color: 'rgba(255,255,255,0.55)',
          }}>
            <span style={{ color: '#818cf8' }}>{icon}</span>
            {text}
          </div>
        ))}
      </div>

      {/* iOS Instructions */}
      {isIOSDevice ? (
        <>
          <div style={{
            background: 'rgba(99,102,241,0.07)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '14px', padding: '12px 14px', marginBottom: '14px',
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              How to install on iPhone
            </div>
            <div className="pwa-step">
              <div className="pwa-step-num">1</div>
              <div className="pwa-step-text">
                Tap the <span className="pwa-step-icon"><Share2 size={10} /> Share</span> button at the bottom of Safari
              </div>
            </div>
            <div className="pwa-step">
              <div className="pwa-step-num">2</div>
              <div className="pwa-step-text">
                Scroll down and tap <span className="pwa-step-icon"><Plus size={10} /> Add to Home Screen</span>
              </div>
            </div>
            <div className="pwa-step">
              <div className="pwa-step-num">3</div>
              <div className="pwa-step-text">
                Tap <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Add</strong> in the top-right corner — done! 🎉
              </div>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="pwa-dismiss-btn"
            style={{
              width: '100%', padding: '11px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', color: 'rgba(255,255,255,0.55)',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            }}
          >
            Got it, thanks!
          </button>
        </>
      ) : (
        /* Android / Desktop Install */
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleDismiss}
            className="pwa-dismiss-btn"
            style={{
              flex: 1, padding: '11px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px', color: 'rgba(255,255,255,0.5)',
              fontSize: '13px', fontWeight: 500, cursor: 'pointer',
            }}
          >
            Not now
          </button>
          <button
            onClick={handleInstall}
            className="pwa-install-btn"
            style={{
              flex: 2, padding: '11px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              border: 'none', borderRadius: '12px', color: '#fff',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: '0 4px 16px rgba(99,102,241,0.45)',
            }}
          >
            <Download size={14} />
            Install App
          </button>
        </div>
      )}
    </div>
  );
}

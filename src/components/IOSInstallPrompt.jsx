import { useState, useEffect } from 'react';

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
}

export default function IOSInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show only on iOS Safari, not already installed, and not previously dismissed
    if (isIOS() && !isInStandaloneMode() && !sessionStorage.getItem('ios-prompt-dismissed')) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    sessionStorage.setItem('ios-prompt-dismissed', '1');
    setShow(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center p-4" onClick={dismiss}>
      <div className="w-full max-w-sm bg-bg-card border border-border-light rounded-2xl p-5 mb-4"
        onClick={(e) => e.stopPropagation()}>
        <div className="text-center mb-4">
          <div className="text-2xl mb-2">📲</div>
          <h3 className="text-base font-bold text-white">Install EOS Locator</h3>
          <p className="text-xs text-text-muted mt-1">
            Add to your home screen for the best experience and push notifications.
          </p>
        </div>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-teal/15 text-teal flex items-center justify-center text-sm font-bold shrink-0">1</div>
            <p className="text-xs text-text">
              Tap the <span className="text-teal font-bold">Share</span> button <span className="text-lg align-middle">⬆</span> in Safari
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-teal/15 text-teal flex items-center justify-center text-sm font-bold shrink-0">2</div>
            <p className="text-xs text-text">
              Scroll down and tap <span className="text-teal font-bold">Add to Home Screen</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-teal/15 text-teal flex items-center justify-center text-sm font-bold shrink-0">3</div>
            <p className="text-xs text-text">
              Tap <span className="text-teal font-bold">Add</span> to install
            </p>
          </div>
        </div>

        <button onClick={dismiss}
          className="w-full bg-border-light text-text-muted py-2 rounded-lg text-xs font-mono cursor-pointer hover:text-white transition-colors">
          Got it, maybe later
        </button>
      </div>
    </div>
  );
}

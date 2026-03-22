import { useState, useEffect } from 'react';

export default function Toast({ message, type = 'info', onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const colors = {
    ping: 'border-coral bg-coral/10 text-coral',
    broadcast: 'border-teal bg-teal/10 text-teal',
    info: 'border-border-light bg-bg-card text-text',
  };

  const icons = {
    ping: '\u{1F4E1}',
    broadcast: '\u{1F4E2}',
    info: '\u{2139}\u{FE0F}',
  };

  return (
    <div
      className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)]
        border rounded-lg px-4 py-3 font-mono text-xs shadow-lg
        transition-all duration-300 ${colors[type] || colors.info}
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
      onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
    >
      <span className="mr-2">{icons[type] || icons.info}</span>
      {message}
    </div>
  );
}

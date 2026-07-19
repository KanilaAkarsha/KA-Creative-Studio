import { useEffect, useState } from 'react';

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="loader"
      className={`fixed inset-0 z-[100] flex items-center justify-center ${hidden ? 'hidden' : ''}`}
      style={{ background: '#0B1120' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary border-r-accent animate-spin" />
        </div>
        <span className="font-heading font-semibold text-sm tracking-widest uppercase text-txt-secondary">
          KA Studio
        </span>
      </div>
    </div>
  );
}

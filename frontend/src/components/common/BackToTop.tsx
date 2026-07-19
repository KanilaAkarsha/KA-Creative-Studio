import { ArrowUp } from 'lucide-react';
import { useScrollPosition } from '../../hooks/useScrollPosition';

export default function BackToTop() {
  const scrollY = useScrollPosition();
  const visible = scrollY > 500;

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Back to top"
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-accent text-white flex items-center justify-center shadow-lg shadow-primary/25 transition-all duration-300 hover:scale-110 ${
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}

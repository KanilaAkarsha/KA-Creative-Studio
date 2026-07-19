import type { ReactNode } from 'react';
import { useReveal } from '../../hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  delay?: 0 | 1 | 2 | 3 | 4 | 5;
  className?: string;
}

/**
 * Drop-in replacement for the original `reveal reveal-delay-N` class combo.
 * Wraps children and toggles the `active` class once the element scrolls into view.
 */
export default function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const { ref, active } = useReveal<HTMLDivElement>();
  const delayClass = delay > 0 ? `reveal-delay-${delay}` : '';

  return (
    <div ref={ref} className={`reveal ${delayClass} ${active ? 'active' : ''} ${className}`}>
      {children}
    </div>
  );
}

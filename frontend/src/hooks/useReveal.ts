import { useEffect, useRef, useState } from 'react';

/**
 * Replicates the original .reveal / .reveal.active IntersectionObserver behavior.
 * Attach the returned ref to any element and use `active` to toggle the "active" class.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.1) {
  const ref = useRef<T | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(true);
          }
        });
      },
      { threshold, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, active };
}

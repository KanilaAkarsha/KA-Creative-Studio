import { useEffect, useRef, useState } from 'react';

/** Replicates the original skill-bar-fill IntersectionObserver animation. */
export function useSkillBar<T extends HTMLElement = HTMLDivElement>(width: string) {
  const ref = useRef<T | null>(null);
  const [currentWidth, setCurrentWidth] = useState('0%');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCurrentWidth(width);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return { ref, currentWidth };
}

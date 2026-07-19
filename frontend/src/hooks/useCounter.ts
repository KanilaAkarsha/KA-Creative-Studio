import { useEffect, useRef, useState } from 'react';

/** Replicates the original counter-value ease-out-cubic count-up animation. */
export function useCounter<T extends HTMLElement = HTMLDivElement>(target: number, duration = 2000) {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState(0);
  const animatedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            const startTime = performance.now();

            const tick = (currentTime: number) => {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setValue(Math.floor(eased * target));
              if (progress < 1) {
                requestAnimationFrame(tick);
              } else {
                setValue(target);
              }
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, value };
}

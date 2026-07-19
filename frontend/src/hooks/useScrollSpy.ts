import { useEffect, useState } from 'react';

/** Replicates the original active-nav-link-on-scroll logic. */
export function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      let current = '';
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (!section) return;
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
          current = id;
        }
      });
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds]);

  return activeId;
}

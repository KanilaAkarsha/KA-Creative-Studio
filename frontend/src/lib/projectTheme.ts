const CATEGORY_STYLES: Record<string, { bg: string; text: string }> = {
  Branding: { bg: 'bg-primary/20', text: 'text-primary' },
  'Web Design': { bg: 'bg-accent/20', text: 'text-accent' },
  Photography: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  'UI/UX': { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  Videography: { bg: 'bg-rose-500/20', text: 'text-rose-400' },
};

const DEFAULT_STYLE = { bg: 'bg-emerald-500/20', text: 'text-emerald-400' };

export function getCategoryStyle(category: string) {
  return CATEGORY_STYLES[category] ?? DEFAULT_STYLE;
}

export const KNOWN_PROJECT_CATEGORIES = Object.keys(CATEGORY_STYLES);

import type { SkillItem, StatItem } from '../types';

export const stats: StatItem[] = [
  { id: 'projects', target: 150, label: 'Projects Completed' },
  { id: 'clients', target: 50, label: 'Happy Clients' },
  { id: 'years', target: 5, label: 'Years Experience' },
  { id: 'awards', target: 12, label: 'Awards Won' },
];

export const skills: SkillItem[] = [
  { id: 'ui-ux-design', name: 'UI/UX Design', percentage: 95 },
  { id: 'web-development', name: 'Web Development', percentage: 90 },
  { id: 'branding', name: 'Branding', percentage: 88 },
  { id: 'photography', name: 'Photography', percentage: 85 },
];

export const toolTags: string[] = [
  'Figma',
  'React',
  'Next.js',
  'Tailwind',
  'Photoshop',
  'Premiere Pro',
  'Lightroom',
];

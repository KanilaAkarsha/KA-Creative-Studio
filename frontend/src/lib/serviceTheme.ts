import { Palette, Figma, Code2, Camera, Video, Crown, Sparkles, Layers, Rocket, Brush, type LucideIcon } from 'lucide-react';
import type { ServiceColorKey, ServiceIconKey } from '../types';

export const SERVICE_ICON_MAP: Record<ServiceIconKey, LucideIcon> = {
  Palette,
  Figma,
  Code2,
  Camera,
  Video,
  Crown,
  Sparkles,
  Layers,
  Rocket,
  Brush,
};

interface ColorTheme {
  iconColorClass: string;
  bgGradientClass: string;
  borderColorClass: string;
  hoverTextClass: string;
}

export const SERVICE_COLOR_MAP: Record<ServiceColorKey, ColorTheme> = {
  blue: {
    iconColorClass: 'text-blue-400',
    bgGradientClass: 'bg-gradient-to-br from-blue-500/10 to-blue-500/5 dark:bg-blue-500/10',
    borderColorClass: 'border-blue-500/20 border-blue-500/10',
    hoverTextClass: 'text-primary',
  },
  purple: {
    iconColorClass: 'text-purple-400',
    bgGradientClass: 'bg-gradient-to-br from-purple-500/10 to-purple-500/5 dark:bg-purple-500/10',
    borderColorClass: 'border-purple-500/20 border-purple-500/10',
    hoverTextClass: 'text-accent',
  },
  cyan: {
    iconColorClass: 'text-cyan-400',
    bgGradientClass: 'bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 dark:bg-cyan-500/10',
    borderColorClass: 'border-cyan-500/20 border-cyan-500/10',
    hoverTextClass: 'text-cyan-400',
  },
  amber: {
    iconColorClass: 'text-amber-400',
    bgGradientClass: 'bg-gradient-to-br from-amber-500/10 to-amber-500/5 dark:bg-amber-500/10',
    borderColorClass: 'border-amber-500/20 border-amber-500/10',
    hoverTextClass: 'text-amber-400',
  },
  rose: {
    iconColorClass: 'text-rose-400',
    bgGradientClass: 'bg-gradient-to-br from-rose-500/10 to-rose-500/5 dark:bg-rose-500/10',
    borderColorClass: 'border-rose-500/20 border-rose-500/10',
    hoverTextClass: 'text-rose-400',
  },
  emerald: {
    iconColorClass: 'text-emerald-400',
    bgGradientClass: 'bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:bg-emerald-500/10',
    borderColorClass: 'border-emerald-500/20 border-emerald-500/10',
    hoverTextClass: 'text-emerald-400',
  },
  primary: {
    iconColorClass: 'text-primary',
    bgGradientClass: 'bg-gradient-to-br from-primary/10 to-primary/5 dark:bg-primary/10',
    borderColorClass: 'border-primary/20 border-primary/10',
    hoverTextClass: 'text-primary',
  },
  accent: {
    iconColorClass: 'text-accent',
    bgGradientClass: 'bg-gradient-to-br from-accent/10 to-accent/5 dark:bg-accent/10',
    borderColorClass: 'border-accent/20 border-accent/10',
    hoverTextClass: 'text-accent',
  },
};

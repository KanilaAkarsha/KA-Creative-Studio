import type { LucideIcon } from 'lucide-react';

interface SectionBadgeProps {
  icon: LucideIcon;
  label: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export default function SectionBadge({ icon: Icon, label, colorClass, bgClass, borderClass }: SectionBadgeProps) {
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 ${bgClass} ${borderClass}`}>
      <Icon className={`w-3.5 h-3.5 ${colorClass}`} />
      <span className={`text-xs font-semibold tracking-wide uppercase ${colorClass}`}>{label}</span>
    </div>
  );
}

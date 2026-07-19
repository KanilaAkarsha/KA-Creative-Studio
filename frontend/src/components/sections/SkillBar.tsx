import { useSkillBar } from '../../hooks/useSkillBar';
import type { SkillItem } from '../../types';

export default function SkillBar({ skill }: { skill: SkillItem }) {
  const { ref, currentWidth } = useSkillBar<HTMLDivElement>(`${skill.percentage}%`);

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium dark:text-txt-primary text-txt-dark">{skill.name}</span>
        <span className="text-sm font-medium text-primary">{skill.percentage}%</span>
      </div>
      <div className="h-2 rounded-full dark:bg-white/5 bg-black/5 overflow-hidden">
        <div
          ref={ref}
          className="skill-bar-fill h-full rounded-full bg-gradient-to-r from-primary to-accent"
          style={{ width: currentWidth }}
        />
      </div>
    </div>
  );
}

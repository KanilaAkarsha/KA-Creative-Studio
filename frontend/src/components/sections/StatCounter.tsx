import { useCounter } from '../../hooks/useCounter';
import type { StatItem } from '../../types';

export default function StatCounter({ stat }: { stat: StatItem }) {
  const { ref, value } = useCounter<HTMLDivElement>(stat.target);

  return (
    <div className="text-center">
      <div ref={ref} className="counter-value font-heading text-4xl sm:text-5xl font-bold gradient-text">
        {value}+
      </div>
      <div className="text-sm dark:text-txt-secondary text-txt-muted mt-2">{stat.label}</div>
    </div>
  );
}

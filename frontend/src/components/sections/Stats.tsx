import Reveal from '../common/Reveal';
import StatCounter from './StatCounter';
import { stats } from '../../data/stats';

export default function Stats() {
  return (
    <section className="relative py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="gradient-border rounded-3xl dark:bg-dark-surface/60 bg-light-surface/60 backdrop-blur-xl p-10 lg:p-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {stats.map((stat) => (
              <StatCounter key={stat.id} stat={stat} />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

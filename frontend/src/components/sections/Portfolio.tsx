import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Reveal from '../common/Reveal';
import SectionBadge from '../common/SectionBadge';
import ProjectCard from './ProjectCard';
import { portfolioItems } from '../../data/portfolio';
import { useProjects } from '../../hooks/useProjects';

export default function Portfolio() {
  const { data: backendProjects, isLoading, isError } = useProjects();

  const allItems =
    !isLoading && !isError && backendProjects && backendProjects.length > 0 ? backendProjects : portfolioItems;

  const featuredItems = allItems.filter((item) => item.featured);

  return (
    <section id="portfolio" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16 lg:mb-20">
          <div>
            <Reveal>
              <SectionBadge
                icon={Briefcase}
                label="Portfolio"
                colorClass="text-accent"
                bgClass="dark:bg-accent/10 bg-accent/5"
                borderClass="dark:border-accent/20 border-accent/10"
              />
            </Reveal>
            <Reveal delay={1}>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight dark:text-txt-primary text-txt-dark">
                Featured <span className="gradient-text">Works</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={2}>
            <Link
              to="/projects"
              className="group flex items-center gap-2 text-sm font-medium dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        {/* Portfolio Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredItems.map((item, idx) => {
            const delay = (idx % 3) as 0 | 1 | 2;
            const key = 'id' in item ? item.id : item._id;
            return (
              <Reveal key={key} delay={delay}>
                <ProjectCard item={item} large={item.span === 'large'} />
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

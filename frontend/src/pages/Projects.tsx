import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Briefcase } from 'lucide-react';
import Reveal from '../components/common/Reveal';
import SectionBadge from '../components/common/SectionBadge';
import ProjectCard from '../components/sections/ProjectCard';
import { portfolioItems } from '../data/portfolio';
import { useProjects } from '../hooks/useProjects';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const { data: backendProjects, isLoading, isError } = useProjects();

  const allItems =
    !isLoading && !isError && backendProjects && backendProjects.length > 0 ? backendProjects : portfolioItems;

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(allItems.map((item) => item.category)))],
    [allItems]
  );

  const filteredItems =
    activeCategory === 'All' ? allItems : allItems.filter((item) => item.category === activeCategory);

  return (
    <div className="relative min-h-screen pt-32 pb-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/#portfolio"
          className="inline-flex items-center gap-2 text-sm font-medium dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to home</span>
        </Link>

        <div className="max-w-2xl mb-12">
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
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight dark:text-txt-primary text-txt-dark">
              All <span className="gradient-text">Projects</span>
            </h1>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 text-lg dark:text-txt-secondary text-txt-muted">
              Every project, across every discipline — filter by category to browse.
            </p>
          </Reveal>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-primary to-accent text-white'
                  : 'dark:bg-white/5 bg-black/5 dark:text-txt-secondary text-txt-muted hover:dark:text-white hover:text-txt-dark'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        {filteredItems.length === 0 ? (
          <p className="text-center py-16 dark:text-txt-secondary text-txt-muted text-sm">
            No projects in this category yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, idx) => {
              const delay = (idx % 3) as 0 | 1 | 2;
              const key = 'id' in item ? item.id : item._id;
              return (
                <Reveal key={key} delay={delay}>
                  <ProjectCard item={item} />
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

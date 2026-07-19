import { ArrowUpRight } from 'lucide-react';
import { getCategoryStyle } from '../../lib/projectTheme';

interface ProjectCardData {
  title: string;
  description: string;
  category: string;
  image: string;
}

interface ProjectCardProps {
  item: ProjectCardData;
  large?: boolean;
}

export default function ProjectCard({ item, large = false }: ProjectCardProps) {
  const style = getCategoryStyle(item.category);

  return (
    <div className={`portfolio-card rounded-2xl overflow-hidden relative cursor-pointer group ${large ? 'sm:col-span-2 lg:col-span-2' : ''}`}>
      <img
        src={item.image}
        alt={item.title}
        className={`w-full object-cover ${large ? 'h-80 lg:h-96' : 'h-72 lg:h-96'}`}
      />
      <div className="portfolio-overlay absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent flex items-end p-8">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${style.bg} ${style.text}`}>
            {item.category}
          </span>
          <h3 className={`font-heading font-semibold text-white mb-1 ${large ? 'text-2xl' : 'text-xl'}`}>
            {item.title}
          </h3>
          <p className="text-sm text-white/70">{item.description}</p>
        </div>
        {large && (
          <div className="ml-auto mb-2">
            <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
              <ArrowUpRight className="w-5 h-5 text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

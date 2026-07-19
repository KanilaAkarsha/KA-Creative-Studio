import { ArrowRight } from 'lucide-react';
import Reveal from '../common/Reveal';

export default function CTA() {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-90" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(255,255,255,0.08) 0%, transparent 50%)',
            }}
          />
          {/* Floating shapes */}
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/10 rounded-full animate-float" />
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-white/10 rounded-2xl animate-float-delay rotate-45" />
          <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white/20 rounded-full animate-float-slow" />

          <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight max-w-2xl mx-auto">
              Let's Create Something
              <br />
              Extraordinary Together
            </h2>
            <p className="mt-6 text-lg text-white/70 max-w-lg mx-auto">
              Have a project in mind? I'd love to hear about it. Let's turn your vision into reality.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#contact"
                onClick={(e) => handleNav(e, 'contact')}
                className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-dark-bg font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:scale-105"
              >
                <span>Start a Project</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#portfolio"
                onClick={(e) => handleNav(e, 'portfolio')}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/20 text-white font-semibold transition-all duration-300 hover:bg-white/10"
              >
                <span>View Work</span>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

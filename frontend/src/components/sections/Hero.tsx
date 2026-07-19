import { ArrowDownRight, ArrowRight, Sparkles, ArrowUpRight } from 'lucide-react';
import Reveal from '../common/Reveal';

export default function Hero() {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] animate-float-slow" />
        <div
          className="absolute inset-0 dark:opacity-[0.03] opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, #94A3B8 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-32 right-1/4 w-3 h-3 rounded-full bg-primary/40 animate-float" />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 rounded-full bg-accent/40 animate-float-delay" />
        <div className="absolute top-1/2 right-1/3 w-4 h-4 rounded-lg bg-primary/20 animate-float-slow rotate-45" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Reveal className="inline-flex items-center gap-2 px-4 py-2 rounded-full dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium dark:text-txt-secondary text-txt-muted tracking-wide">
                Available for new projects
              </span>
            </Reveal>

            <Reveal delay={1}>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                Designing Digital
                <br />
                Experiences That
                <br />
                <span className="gradient-text">Inspire.</span>
              </h1>
            </Reveal>

            <Reveal delay={2}>
              <p className="text-lg dark:text-txt-secondary text-txt-muted max-w-lg leading-relaxed">
                I craft premium digital experiences — from brand identity to immersive web platforms — that
                captivate audiences and drive real results.
              </p>
            </Reveal>

            <Reveal delay={3} className="flex flex-wrap gap-4">
              <a
                href="#portfolio"
                onClick={(e) => handleNav(e, 'portfolio')}
                className="btn-glow group flex items-center gap-3 px-7 py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
              >
                <span>View Portfolio</span>
                <ArrowDownRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
              </a>
              <a
                href="#contact"
                onClick={(e) => handleNav(e, 'contact')}
                className="group flex items-center gap-3 px-7 py-4 rounded-2xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark font-semibold transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
              >
                <span>Hire Me</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Reveal>

            <Reveal delay={4} className="flex items-center gap-8 pt-4">
              <div>
                <div className="font-heading font-bold text-2xl dark:text-txt-primary text-txt-dark">150+</div>
                <div className="text-xs dark:text-txt-secondary text-txt-muted mt-0.5">Projects Done</div>
              </div>
              <div className="w-px h-10 dark:bg-white/10 bg-black/10" />
              <div>
                <div className="font-heading font-bold text-2xl dark:text-txt-primary text-txt-dark">50+</div>
                <div className="text-xs dark:text-txt-secondary text-txt-muted mt-0.5">Happy Clients</div>
              </div>
              <div className="w-px h-10 dark:bg-white/10 bg-black/10" />
              <div>
                <div className="font-heading font-bold text-2xl dark:text-txt-primary text-txt-dark">5+</div>
                <div className="text-xs dark:text-txt-secondary text-txt-muted mt-0.5">Years Exp.</div>
              </div>
            </Reveal>
          </div>

          {/* Right - Hero Image */}
          <Reveal delay={3} className="relative hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-[60px]" />
              <div className="relative rounded-3xl overflow-hidden border dark:border-white/10 border-black/10 shadow-2xl">
                <img
                  src="https://picsum.photos/seed/ka-hero-creative/700/800.jpg"
                  alt="Creative Work"
                  className="w-full h-[550px] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold dark:text-txt-primary text-txt-dark">Latest Project</div>
                    <div className="text-xs dark:text-txt-secondary text-txt-muted">Brand Identity — NovaTech</div>
                  </div>
                  <div className="ml-auto">
                    <div className="w-8 h-8 rounded-lg dark:bg-white/10 bg-black/10 flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 dark:text-txt-primary text-txt-dark" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 glass rounded-2xl px-4 py-3 animate-float">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <img
                      src="https://picsum.photos/seed/avatar1/40/40.jpg"
                      className="w-7 h-7 rounded-full border-2 border-dark-bg object-cover"
                      alt="Client"
                    />
                    <img
                      src="https://picsum.photos/seed/avatar2/40/40.jpg"
                      className="w-7 h-7 rounded-full border-2 border-dark-bg object-cover"
                      alt="Client"
                    />
                    <img
                      src="https://picsum.photos/seed/avatar3/40/40.jpg"
                      className="w-7 h-7 rounded-full border-2 border-dark-bg object-cover"
                      alt="Client"
                    />
                  </div>
                  <div className="text-xs font-medium dark:text-txt-primary text-txt-dark">+50 Clients</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Scroll indicator */}
      <Reveal delay={5} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] font-medium dark:text-txt-secondary text-txt-muted tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-5 h-8 rounded-full border dark:border-white/20 border-black/20 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce" />
        </div>
      </Reveal>
    </section>
  );
}

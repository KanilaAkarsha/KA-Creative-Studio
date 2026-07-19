import { User } from 'lucide-react';
import Reveal from '../common/Reveal';
import SkillBar from './SkillBar';
import { skills, toolTags } from '../../data/stats';

export default function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Photo Side */}
          <Reveal className="relative">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-[60px]" />
              <div className="relative rounded-3xl overflow-hidden border dark:border-white/10 border-black/10">
                <img
                  src="https://picsum.photos/seed/ka-portrait-studio/600/750.jpg"
                  alt="KA Creative Studio"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 glass rounded-2xl p-6 animate-float">
                <div className="text-center">
                  <div className="font-heading font-bold text-3xl gradient-text">5+</div>
                  <div className="text-xs dark:text-txt-secondary text-txt-muted mt-1">
                    Years of
                    <br />
                    Experience
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Content Side */}
          <div className="space-y-8">
            <Reveal className="inline-flex items-center gap-2 px-4 py-2 rounded-full dark:bg-primary/10 bg-primary/5 border dark:border-primary/20 border-primary/10">
              <User className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">About Me</span>
            </Reveal>

            <Reveal delay={1}>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight dark:text-txt-primary text-txt-dark">
                Crafting Digital
                <br />
                <span className="gradient-text">Excellence</span>
              </h2>
            </Reveal>

            <Reveal delay={2}>
              <p className="dark:text-txt-secondary text-txt-muted text-lg leading-relaxed">
                I'm the creative force behind KA Creative Studio — a multidisciplinary designer and developer
                passionate about building beautiful, functional digital experiences. With over 5 years of
                experience, I blend aesthetics with strategy.
              </p>
            </Reveal>

            <Reveal delay={3}>
              <p className="dark:text-txt-secondary text-txt-muted leading-relaxed">
                My philosophy is simple: great design should be invisible. It should feel natural, guide users
                effortlessly, and leave a lasting impression. Every pixel, every interaction, every detail
                matters.
              </p>
            </Reveal>

            {/* Skills */}
            <Reveal delay={4} className="space-y-4 pt-4">
              {skills.map((skill) => (
                <SkillBar key={skill.id} skill={skill} />
              ))}
            </Reveal>

            <Reveal delay={5} className="flex flex-wrap gap-3 pt-2">
              {toolTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-lg dark:bg-white/5 bg-black/5 text-xs font-medium dark:text-txt-secondary text-txt-muted"
                >
                  {tag}
                </span>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

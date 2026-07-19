import { Mail, MapPin, Clock, Instagram, Twitter, Dribbble, Linkedin, Github } from 'lucide-react';
import Reveal from '../common/Reveal';

const SOCIALS = [Instagram, Twitter, Dribbble, Linkedin, Github];

export default function ContactInfo() {
  return (
    <div className="lg:col-span-2 space-y-6">
      <Reveal delay={1} className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h4 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm mb-1">Email</h4>
            <p className="text-sm dark:text-txt-secondary text-txt-muted">hello@kacreative.studio</p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={2} className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h4 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm mb-1">
              Location
            </h4>
            <p className="text-sm dark:text-txt-secondary text-txt-muted">
              San Francisco, CA
              <br />
              Available worldwide
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={3} className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm mb-1">
              Availability
            </h4>
            <p className="text-sm dark:text-txt-secondary text-txt-muted">
              Mon – Fri, 9am – 6pm PST
              <br />
              Response within 24hrs
            </p>
          </div>
        </div>
      </Reveal>

      {/* Social Links */}
      <Reveal delay={4} className="pt-4">
        <h4 className="text-sm font-medium dark:text-txt-primary text-txt-dark mb-4">Follow Me</h4>
        <div className="flex gap-3">
          {SOCIALS.map((Icon, idx) => (
            <a
              key={idx}
              href="#"
              className="w-11 h-11 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-primary hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

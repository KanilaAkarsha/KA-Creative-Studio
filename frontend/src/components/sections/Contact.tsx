import { Mail } from 'lucide-react';
import Reveal from '../common/Reveal';
import SectionBadge from '../common/SectionBadge';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';

export default function Contact() {
  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -translate-y-1/2" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <Reveal>
            <SectionBadge
              icon={Mail}
              label="Contact"
              colorClass="text-primary"
              bgClass="dark:bg-primary/10 bg-primary/5"
              borderClass="dark:border-primary/20 border-primary/10"
            />
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight dark:text-txt-primary text-txt-dark">
              Get in <span className="gradient-text">Touch</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 text-lg dark:text-txt-secondary text-txt-muted">
              Ready to start your next project? Drop me a message.
            </p>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
          <div className="lg:col-span-3">
            <Reveal>
              <ContactForm />
            </Reveal>
          </div>
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}

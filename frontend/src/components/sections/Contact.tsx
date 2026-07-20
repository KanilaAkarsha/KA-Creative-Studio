import { Link } from 'react-router-dom';
import { Mail, LogIn, MessageSquareText } from 'lucide-react';
import Reveal from '../common/Reveal';
import SectionBadge from '../common/SectionBadge';
import ContactForm from './ContactForm';
import ContactInfo from './ContactInfo';
import { useAuth } from '../../context/AuthContext';

export default function Contact() {
  const { user } = useAuth();

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
                {user ? (
                    <div className="space-y-4">
                      <ContactForm />
                      <Link
                          to="/account"
                          className="inline-flex items-center gap-2 text-sm font-medium dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors"
                      >
                        <MessageSquareText className="w-4 h-4" />
                        <span>View your message history</span>
                      </Link>
                    </div>
                ) : (
                    <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-10 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-heading font-semibold text-xl dark:text-txt-primary text-txt-dark mb-2">
                        Log in to send a message
                      </h3>
                      <p className="dark:text-txt-secondary text-txt-muted text-sm max-w-sm mx-auto mb-6">
                        Create a free account (or log in) so I can reply to you directly and you can keep track of our
                        conversation.
                      </p>
                      <Link
                          to="/login"
                          state={{ from: '/' }}
                          className="btn-glow inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>Log In / Sign Up</span>
                      </Link>
                    </div>
                )}
              </Reveal>
            </div>
            <ContactInfo />
          </div>
        </div>
      </section>
  );
}
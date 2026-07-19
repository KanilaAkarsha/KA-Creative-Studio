import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-32">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="font-heading font-bold text-white text-sm">KA</span>
            </div>
            <span className="font-heading font-semibold text-lg dark:text-txt-primary text-txt-dark">Studio</span>
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight dark:text-txt-primary text-txt-dark">
            {title}
          </h1>
          <p className="mt-2 text-sm dark:text-txt-secondary text-txt-muted">{subtitle}</p>
        </div>

        <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-8">
          {children}
        </div>

        <div className="text-center mt-6 text-sm dark:text-txt-secondary text-txt-muted">{footer}</div>
      </div>
    </div>
  );
}

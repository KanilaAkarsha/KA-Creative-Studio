import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface DashboardLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function DashboardLayout({ title, subtitle, children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <div className="relative min-h-screen pt-32 pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight dark:text-txt-primary text-txt-dark">
              {title.split(' ').slice(0, -1).join(' ')}{' '}
              <span className="gradient-text">{title.split(' ').slice(-1)}</span>
            </h1>
            <p className="mt-2 dark:text-txt-secondary text-txt-muted">{subtitle}</p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors"
            >
              ← Back to site
            </Link>
            <div className="flex items-center gap-3 gradient-border rounded-xl dark:bg-dark-surface/80 bg-light-surface/80 px-4 py-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                <span className="font-heading font-bold text-white text-xs">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium dark:text-txt-primary text-txt-dark leading-tight">
                  {user?.name}
                </div>
                <div className="text-xs dark:text-txt-secondary text-txt-muted leading-tight capitalize">
                  {user?.role}
                </div>
              </div>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="w-8 h-8 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}

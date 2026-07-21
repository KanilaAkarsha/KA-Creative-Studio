import { Link } from 'react-router-dom';
import { ArrowRight, User, ShieldCheck, LogOut } from 'lucide-react';
import type { AuthUser } from '../../types';

interface NavLink {
  id: string;
  label: string;
}

interface MobileMenuProps {
  open: boolean;
  links: NavLink[];
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
  user: AuthUser | null;
  onLogout: () => void;
  unrepliedCount?: number;
}

export default function MobileMenu({ open, links, onNavigate, user, onLogout, unrepliedCount = 0 }: MobileMenuProps) {
  return (
      <div className={`mobile-menu lg:hidden glass mx-4 mb-4 rounded-2xl overflow-hidden ${open ? 'open' : ''}`}>
        <div className="p-6 flex flex-col gap-1">
          {links.map((link) => (
              <a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={(e) => onNavigate(e, link.id)}
                  className="mobile-link px-4 py-3 rounded-xl text-sm font-medium dark:text-txt-primary text-txt-dark dark:hover:bg-white/5 hover:bg-black/5 transition-all"
              >
                {link.label}
              </a>
          ))}

          {user ? (
              <div className="pt-3 mt-2 border-t dark:border-white/10 border-black/10 flex flex-col gap-1">
                <div className="px-4 pb-1">
              <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide capitalize ${
                      user.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                  }`}
              >
                {user.role}
              </span>
                </div>
                <Link
                    to={user.role === 'admin' ? '/admin' : '/account'}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium dark:text-txt-primary text-txt-dark dark:hover:bg-white/5 hover:bg-black/5 transition-all"
                >
                  {user.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  <span>{user.role === 'admin' ? 'Admin Dashboard' : 'My Account'}</span>
                  {unrepliedCount > 0 && (
                      <span className="ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unrepliedCount > 9 ? '9+' : unrepliedCount}
                </span>
                  )}
                </Link>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-red-400 dark:hover:bg-white/5 hover:bg-black/5 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
          ) : (
              <div className="pt-3 mt-2 border-t dark:border-white/10 border-black/10 flex flex-col gap-2">
                <Link
                    to="/login"
                    className="px-4 py-3 rounded-xl text-sm font-medium text-center dark:text-txt-primary text-txt-dark dark:hover:bg-white/5 hover:bg-black/5 transition-all"
                >
                  Log In
                </Link>
                <a
                    href="#contact"
                    onClick={(e) => onNavigate(e, 'contact')}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold"
                >
                  <span>Book a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
          )}
        </div>
      </div>
  );
}
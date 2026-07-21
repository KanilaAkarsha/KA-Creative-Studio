import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, ArrowRight, User, LogOut, ShieldCheck } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { useMyContacts, useContacts } from '../../hooks/useContacts';
import { countAwaitingReply } from '../../lib/contactThread';
import MobileMenu from './MobileMenu';

const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'shop', label: 'Shop' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const scrollY = useScrollPosition();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const activeId = useScrollSpy(NAV_LINKS.map((l) => l.id));
  const [menuOpen, setMenuOpen] = useState(false);

  const scrolled = scrollY > 50;

  // Notification dot only — the toast itself fires from within the
  // Account/Admin pages so it doesn't double-fire while those are also
  // mounted (Navbar renders there too).
  const { data: customerThreads } = useMyContacts(!!user && user.role === 'customer');
  const { data: adminThreads } = useContacts(!!user && user.role === 'admin');
  const unrepliedCount =
      user?.role === 'admin' ? countAwaitingReply(adminThreads, 'admin') : countAwaitingReply(customerThreads, 'user');

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${id}`);
    }
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
      <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
              scrolled ? 'glass border-b dark:border-white/5 border-black/5' : ''
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <span className="font-heading font-bold text-white text-sm">KA</span>
              </div>
              <span className="font-heading font-semibold text-lg dark:text-txt-primary text-txt-dark hidden sm:block">
              Studio
            </span>
            </Link>

            {/* Desktop Menu */}
            {isHome && (
                <div className="hidden lg:flex items-center gap-8">
                  {NAV_LINKS.map((link) => (
                      <a
                          key={link.id}
                          href={`#${link.id}`}
                          onClick={(e) => handleNavClick(e, link.id)}
                          className={`nav-link text-sm font-medium transition-colors ${
                              activeId === link.id
                                  ? 'active dark:text-txt-primary text-txt-dark'
                                  : 'dark:text-txt-secondary text-txt-muted dark:hover:text-white hover:text-txt-dark'
                          }`}
                      >
                        {link.label}
                      </a>
                  ))}
                </div>
            )}

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                  onClick={toggleTheme}
                  className="w-10 h-10 rounded-xl dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 flex items-center justify-center transition-all duration-300"
                  aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                    <Moon className="w-4 h-4 dark:text-txt-secondary text-txt-muted" />
                ) : (
                    <Sun className="w-4 h-4 dark:text-txt-secondary text-txt-muted" />
                )}
              </button>

              {user ? (
                  <div className="hidden sm:flex items-center gap-2">
                <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide capitalize ${
                        user.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                    }`}
                >
                  {user.role}
                </span>
                    <Link
                        to={user.role === 'admin' ? '/admin' : '/account'}
                        className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl dark:bg-white/5 bg-black/5 dark:text-txt-primary text-txt-dark text-sm font-semibold transition-all duration-300 hover:bg-primary/10"
                    >
                      {user.role === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      <span>{user.role === 'admin' ? 'Admin' : 'My Account'}</span>
                      {unrepliedCount > 0 && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 border-2 dark:border-dark-bg border-light-bg" />
                      )}
                    </Link>
                    <button
                        onClick={handleLogout}
                        aria-label="Log out"
                        className="w-10 h-10 rounded-xl dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 flex items-center justify-center transition-all duration-300"
                    >
                      <LogOut className="w-4 h-4 dark:text-txt-secondary text-txt-muted" />
                    </button>
                  </div>
              ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link
                        to="/login"
                        className="px-4 py-2.5 rounded-xl text-sm font-semibold dark:text-txt-primary text-txt-dark dark:hover:bg-white/5 hover:bg-black/5 transition-all duration-300"
                    >
                      Log In
                    </Link>
                    <a
                        href="#contact"
                        onClick={(e) => handleNavClick(e, 'contact')}
                        className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
                    >
                      <span>Book a Project</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
              )}

              {/* Mobile Menu Button */}
              <button
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="lg:hidden w-10 h-10 rounded-xl dark:bg-white/5 bg-black/5 dark:hover:bg-white/10 hover:bg-black/10 flex items-center justify-center transition-all duration-300"
                  aria-label="Menu"
              >
                {menuOpen ? (
                    <X className="w-5 h-5 dark:text-txt-primary text-txt-dark" />
                ) : (
                    <Menu className="w-5 h-5 dark:text-txt-primary text-txt-dark" />
                )}
              </button>
            </div>
          </div>
        </div>

        <MobileMenu
            open={menuOpen}
            links={isHome ? NAV_LINKS : []}
            onNavigate={handleNavClick}
            user={user}
            onLogout={handleLogout}
            unrepliedCount={unrepliedCount}
        />
      </nav>
  );
}
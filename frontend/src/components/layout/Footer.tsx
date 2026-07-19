import { Instagram, Twitter, Dribbble, Linkedin } from 'lucide-react';

const QUICK_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'services', label: 'Services' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'shop', label: 'Shop' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

const SERVICE_LINKS = [
  'Graphic Design',
  'UI/UX Design',
  'Web Development',
  'Photography',
  'Videography',
  'Branding',
];

const SOCIALS = [Instagram, Twitter, Dribbble, Linkedin];

export default function Footer() {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="relative border-t dark:border-white/5 border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" onClick={(e) => handleNav(e, 'home')} className="flex items-center gap-2 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="font-heading font-bold text-white text-sm">KA</span>
              </div>
              <span className="font-heading font-semibold text-lg dark:text-txt-primary text-txt-dark">
                Creative Studio
              </span>
            </a>
            <p className="dark:text-txt-secondary text-txt-muted text-sm leading-relaxed max-w-sm mb-6">
              Crafting premium digital experiences that inspire, engage, and convert. Let's build something
              extraordinary.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={(e) => handleNav(e, link.id)}
                    className="text-sm dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {SERVICE_LINKS.map((service) => (
                <li key={service}>
                  <a href="#" className="text-sm dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors">
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t dark:border-white/5 border-black/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs dark:text-txt-secondary text-txt-muted">
            © {new Date().getFullYear()} KA Creative Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

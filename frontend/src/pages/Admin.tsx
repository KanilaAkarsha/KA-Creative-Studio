import { useState } from 'react';
import { Mail, ShoppingCart, BarChart3, Users, Briefcase, Layers, Package, MessageSquare } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import Analytics from '../components/dashboard/Analytics';
import ContactsPanel from '../components/dashboard/ContactsPanel';
import OrdersPanel from '../components/dashboard/OrdersPanel';
import UsersPanel from '../components/dashboard/UsersPanel';
import ProjectsPanel from '../components/dashboard/ProjectsPanel';
import ServicesPanel from '../components/dashboard/ServicesPanel';
import ProductsPanel from '../components/dashboard/ProductsPanel';
import ReviewsPanel from '../components/dashboard/ReviewsPanel';
import { useContacts } from '../hooks/useContacts';
import { countAwaitingReply } from '../lib/contactThread';

type Tab = 'contacts' | 'orders' | 'analytics' | 'users' | 'projects' | 'services' | 'products' | 'reviews';

const TABS: Array<{ id: Tab; label: string; icon: typeof Mail }> = [
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'contacts', label: 'Messages', icon: Mail },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'reviews', label: 'Reviews', icon: MessageSquare },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'projects', label: 'Projects', icon: Briefcase },
  { id: 'services', label: 'Services', icon: Layers },
  { id: 'products', label: 'Products', icon: Package },
];

export default function Admin() {
  const [tab, setTab] = useState<Tab>('analytics');

  // Badge count only — the "new message" toast now fires from the Navbar
  // (mounted on every page), so it doesn't double-fire here too.
  const { data: threads } = useContacts(true);
  const unrepliedCount = countAwaitingReply(threads, 'admin');

  return (
      <DashboardLayout
          title="Admin Dashboard"
          subtitle="Manage users, content, orders, and view performance."
      >
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
              <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      tab === id
                          ? 'bg-gradient-to-r from-primary to-accent text-white'
                          : 'dark:bg-white/5 bg-black/5 dark:text-txt-secondary text-txt-muted'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
                {id === 'contacts' && unrepliedCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                {unrepliedCount > 9 ? '9+' : unrepliedCount}
              </span>
                )}
              </button>
          ))}
        </div>

        {/* Content — only the active tab's panel is mounted, so each panel's
          hooks fetch fresh data exactly when it becomes visible. */}
        {tab === 'analytics' && <Analytics />}
        {tab === 'contacts' && <ContactsPanel />}
        {tab === 'orders' && <OrdersPanel />}
        {tab === 'reviews' && <ReviewsPanel />}
        {tab === 'users' && <UsersPanel />}
        {tab === 'projects' && <ProjectsPanel />}
        {tab === 'services' && <ServicesPanel />}
        {tab === 'products' && <ProductsPanel />}
      </DashboardLayout>
  );
}
import { ShoppingBag, Plus, CreditCard, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Reveal from '../common/Reveal';
import SectionBadge from '../common/SectionBadge';
import { shopItems } from '../../data/shop';
import { useProducts } from '../../hooks/useProducts';
import { useCheckout } from '../../hooks/useCheckout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import type { Product } from '../../types';

// Presentation-only styling per product slug — the backend owns title/price/etc,
// this just maps each known product to the original design's accent colors.
const STYLE_BY_SLUG: Record<
  string,
  {
    categoryBgClass: string;
    categoryTextClass: string;
    buttonBgClass: string;
    buttonTextClass: string;
    buttonHoverBgClass: string;
  }
> = {
  'social-media-pack': {
    categoryBgClass: 'bg-primary/10',
    categoryTextClass: 'text-primary',
    buttonBgClass: 'bg-primary/10',
    buttonTextClass: 'text-primary',
    buttonHoverBgClass: 'hover:bg-primary',
  },
  'cinematic-presets': {
    categoryBgClass: 'bg-amber-500/10',
    categoryTextClass: 'text-amber-400',
    buttonBgClass: 'bg-amber-500/10',
    buttonTextClass: 'text-amber-400',
    buttonHoverBgClass: 'hover:bg-amber-500',
  },
  'minimal-icon-set': {
    categoryBgClass: 'bg-purple-500/10',
    categoryTextClass: 'text-purple-400',
    buttonBgClass: 'bg-purple-500/10',
    buttonTextClass: 'text-purple-400',
    buttonHoverBgClass: 'hover:bg-accent',
  },
  'dashboard-ui-kit': {
    categoryBgClass: 'bg-cyan-500/10',
    categoryTextClass: 'text-cyan-400',
    buttonBgClass: 'bg-cyan-500/10',
    buttonTextClass: 'text-cyan-400',
    buttonHoverBgClass: 'hover:bg-cyan-500',
  },
};

const DEFAULT_STYLE = STYLE_BY_SLUG['social-media-pack'];

export default function Shop() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: products, isLoading, isError } = useProducts();
  const checkoutMutation = useCheckout();

  // Fall back to the static catalog (e.g. backend not running yet) so the
  // section still renders something sensible during local development.
  const items: Array<Pick<Product, 'title' | 'description' | 'category' | 'price' | 'image'> & { id: string }> =
    !isLoading && !isError && products && products.length > 0
      ? products.map((p) => ({ id: p._id, title: p.title, description: p.description, category: p.category, price: p.price, image: p.image }))
      : shopItems.map((s) => ({ id: s.id, title: s.title, description: s.description, category: s.category, price: s.price, image: s.image }));

  const usingLiveProducts = !isLoading && !isError && products && products.length > 0;

  const handleBuy = async (id: string) => {
    if (!user) {
      showToast('Please log in to purchase this product.', 'info');
      navigate('/login', { state: { from: '/' } });
      return;
    }
    if (!usingLiveProducts) {
      showToast('Shop is not connected yet — try again once the backend is running.', 'error');
      return;
    }
    try {
      // On success this redirects the browser to Stripe Checkout.
      await checkoutMutation.mutateAsync(id);
    } catch {
      showToast('Could not start checkout. Please try again.', 'error');
    }
  };

  return (
    <section id="shop" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Reveal>
            <SectionBadge
              icon={ShoppingBag}
              label="Shop"
              colorClass="text-emerald-400"
              bgClass="dark:bg-emerald-500/10 bg-emerald-500/5"
              borderClass="dark:border-emerald-500/20 border-emerald-500/10"
            />
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight dark:text-txt-primary text-txt-dark">
              Digital <span className="gradient-text">Products</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 text-lg dark:text-txt-secondary text-txt-muted">
              Premium templates, presets, and resources for creators.
            </p>
          </Reveal>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => {
            const delay = (idx % 4) as 0 | 1 | 2 | 3;
            const style =
              STYLE_BY_SLUG[shopItems.find((s) => s.title === item.title)?.id ?? ''] ?? DEFAULT_STYLE;
            const isRedirecting = checkoutMutation.isPending && checkoutMutation.variables === item.id;

            return (
              <Reveal
                key={item.id}
                delay={delay}
                className="card-hover gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide mb-3 ${style.categoryBgClass} ${style.categoryTextClass}`}
                  >
                    {item.category}
                  </span>
                  <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs dark:text-txt-secondary text-txt-muted mb-3">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-lg dark:text-txt-primary text-txt-dark">
                      ${item.price}
                    </span>
                    <button
                      onClick={() => handleBuy(item.id)}
                      disabled={isRedirecting}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center hover:text-white transition-all duration-300 disabled:opacity-60 ${style.buttonBgClass} ${style.buttonTextClass} ${style.buttonHoverBgClass}`}
                      aria-label={`Buy ${item.title}`}
                      title="Buy with card via Stripe"
                    >
                      {isRedirecting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <p className="text-center text-xs dark:text-txt-secondary text-txt-muted mt-8 flex items-center justify-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" />
          Secure checkout powered by Stripe
        </p>
      </div>
    </section>
  );
}

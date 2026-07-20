import type { LucideIcon } from 'lucide-react';

export interface ServiceItem {
  id: string;
  icon: LucideIcon;
  iconColorClass: string;
  bgGradientClass: string;
  borderColorClass: string;
  title: string;
  description: string;
  hoverTextClass: string;
  longDescription: string;
  features: string[];
  startingPrice: string;
}

export interface PortfolioItem {
  id: string;
  image: string;
  alt: string;
  category: string;
  categoryBgClass: string;
  categoryTextClass: string;
  title: string;
  description: string;
  span: 'large' | 'normal';
  featured: boolean;
}

export interface ShopItem {
  id: string;
  image: string;
  alt: string;
  category: string;
  categoryBgClass: string;
  categoryTextClass: string;
  title: string;
  description: string;
  price: number;
  buttonBgClass: string;
  buttonTextClass: string;
  buttonHoverBgClass: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  avatar: string;
  name: string;
  role: string;
}

export interface StatItem {
  id: string;
  target: number;
  label: string;
}

export interface SkillItem {
  id: string;
  name: string;
  percentage: number;
}

export interface ContactMessage {
  _id: string;
  sender: 'user' | 'admin';
  text: string;
  createdAt: string;
}

export interface ContactThread {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  name: string;
  email: string;
  service: string;
  preferredDate?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  messages: ContactMessage[];
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'customer' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Product {
  _id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
  downloadUrl: string;
  active: boolean;
  createdAt: string;
}

export interface Order {
  _id: string;
  user: string | { _id: string; name: string; email: string };
  product: string | { _id: string; title: string; image?: string; downloadUrl?: string; category?: string };
  title: string;
  price: number;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  createdAt: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  image: string;
  span: 'large' | 'normal';
  featured: boolean;
  order: number;
  active: boolean;
  createdAt: string;
}

export type ServiceIconKey = 'Palette' | 'Figma' | 'Code2' | 'Camera' | 'Video' | 'Crown' | 'Sparkles' | 'Layers' | 'Rocket' | 'Brush';
export type ServiceColorKey = 'blue' | 'purple' | 'cyan' | 'amber' | 'rose' | 'emerald' | 'primary' | 'accent';

export interface Service {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  startingPrice: string;
  icon: ServiceIconKey;
  color: ServiceColorKey;
  order: number;
  active: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  user?: string | { _id: string; name: string; email: string };
  name: string;
  role: string;
  avatar?: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  googleId?: string;
  avatar?: string;
  createdAt: string;
}
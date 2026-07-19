/**
 * Seeds sample data so the app has real content to display and manage from
 * the start: shop products, portfolio projects, services, a few approved
 * reviews, and one admin account.
 *
 * Usage:
 *   node src/scripts/seed.js
 *
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME from the environment if
 * present, otherwise falls back to the defaults below. Change the password
 * after first login in a real deployment.
 */
import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Review from '../models/Review.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

dotenv.config();

const products = [
  {
    slug: 'social-media-pack',
    title: 'Social Media Pack',
    description: '50+ premium templates',
    category: 'Templates',
    price: 29,
    image: 'https://picsum.photos/seed/ka-shop1/400/300.jpg',
    downloadUrl: 'https://example.com/downloads/social-media-pack.zip',
  },
  {
    slug: 'cinematic-presets',
    title: 'Cinematic Presets',
    description: '20 Lightroom presets',
    category: 'Presets',
    price: 19,
    image: 'https://picsum.photos/seed/ka-shop2/400/300.jpg',
    downloadUrl: 'https://example.com/downloads/cinematic-presets.zip',
  },
  {
    slug: 'minimal-icon-set',
    title: 'Minimal Icon Set',
    description: '200+ vector icons',
    category: 'Icons',
    price: 15,
    image: 'https://picsum.photos/seed/ka-shop3/400/300.jpg',
    downloadUrl: 'https://example.com/downloads/minimal-icon-set.zip',
  },
  {
    slug: 'dashboard-ui-kit',
    title: 'Dashboard UI Kit',
    description: 'Complete Figma kit',
    category: 'UI Kit',
    price: 49,
    image: 'https://picsum.photos/seed/ka-shop4/400/300.jpg',
    downloadUrl: 'https://example.com/downloads/dashboard-ui-kit.zip',
  },
];

const projects = [
  {
    slug: 'novatech-brand-identity',
    title: 'NovaTech Brand Identity',
    description: 'Complete brand system for a tech startup',
    category: 'Branding',
    image: 'https://picsum.photos/seed/ka-project-brand/900/500.jpg',
    span: 'large',
    featured: true,
    order: 0,
  },
  {
    slug: 'zenith-platform',
    title: 'Zenith Platform',
    description: 'SaaS dashboard design',
    category: 'Web Design',
    image: 'https://picsum.photos/seed/ka-project-web/500/600.jpg',
    span: 'normal',
    featured: true,
    order: 1,
  },
  {
    slug: 'urban-stories',
    title: 'Urban Stories',
    description: 'Editorial photo series',
    category: 'Photography',
    image: 'https://picsum.photos/seed/ka-project-photo/500/500.jpg',
    span: 'normal',
    featured: true,
    order: 2,
  },
  {
    slug: 'flow-app',
    title: 'Flow App',
    description: 'Mobile fitness application',
    category: 'UI/UX',
    image: 'https://picsum.photos/seed/ka-project-app/500/500.jpg',
    span: 'normal',
    featured: true,
    order: 3,
  },
  {
    slug: 'luxe-campaign',
    title: 'Luxe Campaign',
    description: 'Product launch video',
    category: 'Videography',
    image: 'https://picsum.photos/seed/ka-project-video/500/500.jpg',
    span: 'normal',
    featured: true,
    order: 4,
  },
  {
    slug: 'aurora-skincare',
    title: 'Aurora Skincare',
    description: 'Packaging & identity for a clean-beauty line',
    category: 'Branding',
    image: 'https://picsum.photos/seed/ka-project-aurora/500/500.jpg',
    span: 'normal',
    featured: false,
    order: 5,
  },
  {
    slug: 'bloom-bakery',
    title: 'Bloom Bakery',
    description: 'E-commerce site for a local bakery chain',
    category: 'Web Design',
    image: 'https://picsum.photos/seed/ka-project-bloom/500/500.jpg',
    span: 'normal',
    featured: false,
    order: 6,
  },
  {
    slug: 'wildline-outdoors',
    title: 'Wildline Outdoors',
    description: 'Adventure gear brand campaign film',
    category: 'Videography',
    image: 'https://picsum.photos/seed/ka-project-wildline/500/500.jpg',
    span: 'normal',
    featured: false,
    order: 7,
  },
  {
    slug: 'pulse-fitness-app',
    title: 'Pulse Fitness App',
    description: 'Workout tracking app redesign',
    category: 'UI/UX',
    image: 'https://picsum.photos/seed/ka-project-pulse/500/500.jpg',
    span: 'normal',
    featured: false,
    order: 8,
  },
  {
    slug: 'nomad-travel-blog',
    title: 'Nomad Travel Blog',
    description: 'Travel photography series across Southeast Asia',
    category: 'Photography',
    image: 'https://picsum.photos/seed/ka-project-nomad/500/500.jpg',
    span: 'normal',
    featured: false,
    order: 9,
  },
];

const services = [
  {
    title: 'Graphic Design',
    description: "Stunning visuals that communicate your brand's story with clarity and impact across all mediums.",
    longDescription:
      'From social media graphics to print collateral, I design visuals that stay true to your brand system while standing out in a crowded feed or a stack of flyers.',
    features: [
      'Social media graphics & templates',
      'Print design (flyers, brochures, packaging)',
      'Custom illustrations & iconography',
      'Presentation & pitch deck design',
      'Unlimited revisions within scope',
    ],
    startingPrice: 'From $450',
    icon: 'Palette',
    color: 'blue',
    order: 0,
  },
  {
    title: 'UI/UX Design',
    description: 'Intuitive, user-centered interfaces that delight users and drive engagement and conversions.',
    longDescription:
      'Good UI/UX design disappears — users just get where they need to go. I research, wireframe, and prototype in Figma, then test and refine until the interface feels effortless.',
    features: [
      'User research & journey mapping',
      'Wireframes & interactive prototypes',
      'Design systems & component libraries',
      'Usability testing & iteration',
      'Developer-ready handoff files',
    ],
    startingPrice: 'From $1,200',
    icon: 'Figma',
    color: 'purple',
    order: 1,
  },
  {
    title: 'Web Development',
    description: 'Pixel-perfect, performant websites built with modern tech stacks and clean, scalable code.',
    longDescription:
      'I build fast, responsive websites and web apps using modern frameworks like React and Next.js, with performance budgets and accessibility as non-negotiables.',
    features: [
      'Custom React / Next.js builds',
      'CMS integration (headless or traditional)',
      'Performance & SEO optimization',
      'Responsive, cross-browser testing',
      'Ongoing maintenance & support plans',
    ],
    startingPrice: 'From $2,000',
    icon: 'Code2',
    color: 'cyan',
    order: 2,
  },
  {
    title: 'Photography',
    description: 'Professional photography that captures authentic moments and elevates your visual narrative.',
    longDescription:
      'Whether it is product shots, editorial portraits, or an event, I bring a cinematic eye and a fast turnaround.',
    features: [
      'Product & e-commerce photography',
      'Editorial & portrait sessions',
      'Event coverage',
      'Professional retouching included',
      'Fast 48-hour preview turnaround',
    ],
    startingPrice: 'From $350 / session',
    icon: 'Camera',
    color: 'amber',
    order: 3,
  },
  {
    title: 'Videography',
    description: 'Cinematic video production from concept to final cut that tells your story beautifully.',
    longDescription:
      'From concept to final color grade, I produce brand films, product launches, and social content that hold attention and drive action.',
    features: [
      'Brand films & product launches',
      'Social media video content',
      'Scriptwriting & storyboarding',
      'Professional color grading & sound design',
      'Multiple format exports (16:9, 9:16, 1:1)',
    ],
    startingPrice: 'From $1,800',
    icon: 'Video',
    color: 'rose',
    order: 4,
  },
  {
    title: 'Branding',
    description: 'Comprehensive brand strategy and identity systems that make you memorable and iconic.',
    longDescription:
      'A brand is more than a logo — it is a system. I define your positioning, voice, and visual identity, then package it into guidelines your team can use consistently.',
    features: [
      'Brand strategy & positioning',
      'Logo & visual identity systems',
      'Brand guideline documents',
      'Naming & messaging support',
      'Launch collateral (business cards, letterhead, etc.)',
    ],
    startingPrice: 'From $2,500',
    icon: 'Crown',
    color: 'emerald',
    order: 5,
  },
];

const reviews = [
  {
    name: 'Sarah Chen',
    role: 'CEO, NovaTech',
    avatar: 'https://picsum.photos/seed/client1-face/80/80.jpg',
    rating: 5,
    comment:
      'KA transformed our entire brand identity. The attention to detail and creative vision was beyond what we expected. Truly world-class work.',
    status: 'approved',
  },
  {
    name: 'Marcus Johnson',
    role: 'Founder, Flow App',
    avatar: 'https://picsum.photos/seed/client2-face/80/80.jpg',
    rating: 5,
    comment:
      'The website KA built for us increased our conversions by 40%. The UX is flawless and our users constantly compliment the design. Highly recommend.',
    status: 'approved',
  },
  {
    name: 'Emma Williams',
    role: 'Creative Director, Luxe',
    avatar: 'https://picsum.photos/seed/client3-face/80/80.jpg',
    rating: 5,
    comment:
      'Working with KA was an absolute pleasure. Professional, creative, and always delivered on time. The photography work was absolutely stunning.',
    status: 'approved',
  },
];

async function seed() {
  await connectDB();

  for (const p of products) {
    await Product.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
  }
  console.log(`Seeded ${products.length} products.`);

  for (const p of projects) {
    await Project.findOneAndUpdate({ slug: p.slug }, p, { upsert: true, new: true });
  }
  console.log(`Seeded ${projects.length} projects.`);

  for (const s of services) {
    await Service.findOneAndUpdate({ title: s.title }, s, { upsert: true, new: true });
  }
  console.log(`Seeded ${services.length} services.`);

  for (const r of reviews) {
    const existing = await Review.findOne({ name: r.name, comment: r.comment });
    if (!existing) await Review.create(r);
  }
  console.log(`Seeded ${reviews.length} sample reviews.`);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@kacreative.studio';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const adminName = process.env.ADMIN_NAME || 'KA Admin';

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({ name: adminName, email: adminEmail, password: adminPassword, role: 'admin' });
    console.log(`Created admin account: ${adminEmail} / ${adminPassword}`);
    console.log('Log in with these credentials, then change the password.');
  } else {
    console.log(`Admin account already exists: ${adminEmail}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ArrowRight, Check } from 'lucide-react';
import Reveal from '../common/Reveal';
import SectionBadge from '../common/SectionBadge';
import Modal from '../common/Modal';
import { services as staticServices } from '../../data/services';
import { useServices } from '../../hooks/useServices';
import { SERVICE_ICON_MAP, SERVICE_COLOR_MAP } from '../../lib/serviceTheme';
import type { ServiceItem } from '../../types';

export default function Services() {
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);
  const navigate = useNavigate();
  const { data: backendServices, isLoading, isError } = useServices();

  const services: ServiceItem[] =
    !isLoading && !isError && backendServices && backendServices.length > 0
      ? backendServices.map((s) => {
          const theme = SERVICE_COLOR_MAP[s.color];
          return {
            id: s._id,
            icon: SERVICE_ICON_MAP[s.icon],
            iconColorClass: theme.iconColorClass,
            bgGradientClass: theme.bgGradientClass,
            borderColorClass: theme.borderColorClass,
            hoverTextClass: theme.hoverTextClass,
            title: s.title,
            description: s.description,
            longDescription: s.longDescription,
            features: s.features,
            startingPrice: s.startingPrice,
          };
        })
      : staticServices;

  const handleGetStarted = () => {
    setActiveService(null);
    const id = 'contact';
    if (window.location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="services" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <Reveal>
            <SectionBadge
              icon={Layers}
              label="Services"
              colorClass="text-primary"
              bgClass="dark:bg-primary/10 bg-primary/5"
              borderClass="dark:border-primary/20 border-primary/10"
            />
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight dark:text-txt-primary text-txt-dark">
              What I <span className="gradient-text">Bring</span> to the Table
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 text-lg dark:text-txt-secondary text-txt-muted">
              End-to-end creative solutions tailored to elevate your brand and digital presence.
            </p>
          </Reveal>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const delay = (idx % 3) as 0 | 1 | 2;
            return (
              <Reveal
                key={service.id}
                delay={delay}
                className="service-card card-hover gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-8 group cursor-pointer"
              >
                <div
                  className={`service-icon w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 ${service.bgGradientClass} ${service.borderColorClass}`}
                >
                  <Icon className={`w-6 h-6 ${service.iconColorClass}`} />
                </div>
                <h3 className="font-heading font-semibold text-xl dark:text-txt-primary text-txt-dark mb-3">
                  {service.title}
                </h3>
                <p className="dark:text-txt-secondary text-txt-muted text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <button
                  onClick={() => setActiveService(service)}
                  className={`flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${service.hoverTextClass}`}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Learn More detail modal */}
      <Modal open={!!activeService} onClose={() => setActiveService(null)}>
        {activeService && (
          <div>
            <div
              className={`w-14 h-14 rounded-2xl border flex items-center justify-center mb-5 ${activeService.bgGradientClass} ${activeService.borderColorClass}`}
            >
              <activeService.icon className={`w-6 h-6 ${activeService.iconColorClass}`} />
            </div>
            <h3 className="font-heading font-bold text-2xl dark:text-txt-primary text-txt-dark mb-1">
              {activeService.title}
            </h3>
            <p className={`text-sm font-semibold mb-4 ${activeService.hoverTextClass}`}>
              {activeService.startingPrice}
            </p>
            <p className="dark:text-txt-secondary text-txt-muted text-sm leading-relaxed mb-6">
              {activeService.longDescription}
            </p>
            <ul className="space-y-3 mb-8">
              {activeService.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm dark:text-txt-secondary text-txt-muted">
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${activeService.hoverTextClass}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleGetStarted}
              className="btn-glow w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary/25"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}

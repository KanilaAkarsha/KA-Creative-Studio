import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Star, PenLine } from 'lucide-react';
import Reveal from '../common/Reveal';
import SectionBadge from '../common/SectionBadge';
import WriteReviewModal from './WriteReviewModal';
import { testimonials as staticTestimonials } from '../../data/testimonials';
import { useReviews } from '../../hooks/useReviews';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Testimonials() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: reviews, isLoading, isError } = useReviews();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const items =
    !isLoading && !isError && reviews && reviews.length > 0
      ? reviews.map((r) => ({
          id: r._id,
          quote: r.comment,
          avatar: r.avatar || `https://picsum.photos/seed/${r._id}/80/80.jpg`,
          name: r.name,
          role: r.role,
          rating: r.rating,
        }))
      : staticTestimonials.map((t) => ({ ...t, rating: 5 }));

  const handleWriteReview = () => {
    if (!user) {
      showToast('Please log in to write a review.', 'info');
      navigate('/login', { state: { from: '/' } });
      return;
    }
    setModalOpen(true);
  };

  return (
    <section className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 lg:mb-20">
          <Reveal>
            <SectionBadge
              icon={MessageCircle}
              label="Testimonials"
              colorClass="text-amber-400"
              bgClass="dark:bg-amber-500/10 bg-amber-500/5"
              borderClass="dark:border-amber-500/20 border-amber-500/10"
            />
          </Reveal>
          <Reveal delay={1}>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight dark:text-txt-primary text-txt-dark">
              Client <span className="gradient-text">Love</span>
            </h2>
          </Reveal>
          <Reveal delay={2}>
            <p className="mt-4 text-lg dark:text-txt-secondary text-txt-muted">
              What people say about working with me.
            </p>
          </Reveal>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((testimonial, idx) => {
            const delay = (idx % 3) as 0 | 1 | 2;
            return (
              <Reveal
                key={testimonial.id}
                delay={delay}
                className="testimonial-card gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-8"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, starIdx) => (
                    <Star
                      key={starIdx}
                      className={`w-4 h-4 ${starIdx < testimonial.rating ? 'star-filled fill-current' : 'text-white/20'}`}
                    />
                  ))}
                </div>
                <p className="dark:text-txt-secondary text-txt-muted text-sm leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-semibold dark:text-txt-primary text-txt-dark">
                      {testimonial.name}
                    </div>
                    {testimonial.role && (
                      <div className="text-xs dark:text-txt-secondary text-txt-muted">{testimonial.role}</div>
                    )}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="flex justify-center mt-12">
          <button
            onClick={handleWriteReview}
            className="btn-glow flex items-center gap-2 px-6 py-3.5 rounded-xl dark:bg-white/5 bg-black/5 border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark font-semibold transition-all duration-300 hover:border-primary/50 hover:bg-primary/5"
          >
            <PenLine className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>
      </div>

      <WriteReviewModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}

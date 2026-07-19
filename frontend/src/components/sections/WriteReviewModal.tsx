import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star, Send, Loader2 } from 'lucide-react';
import Modal from '../common/Modal';
import { reviewSchema, type ReviewValues } from '../../lib/validation';
import { useSubmitReview } from '../../hooks/useReviews';
import { useToast } from '../../context/ToastContext';

interface WriteReviewModalProps {
  open: boolean;
  onClose: () => void;
}

export default function WriteReviewModal({ open, onClose }: WriteReviewModalProps) {
  const [hoverRating, setHoverRating] = useState(0);
  const submitReview = useSubmitReview();
  const { showToast } = useToast();

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '', role: '' },
  });

  const rating = watch('rating');

  const handleClose = () => {
    reset();
    setHoverRating(0);
    onClose();
  };

  const onSubmit = async (values: ReviewValues) => {
    try {
      const result = await submitReview.mutateAsync(values);
      showToast(result.message, 'success');
      handleClose();
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Could not submit your review. Please try again.';
      showToast(message, 'error');
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <h3 className="font-heading font-bold text-2xl dark:text-txt-primary text-txt-dark mb-1">Write a Review</h3>
      <p className="text-sm dark:text-txt-secondary text-txt-muted mb-6">
        Share your experience working with KA Creative Studio. Reviews are checked before appearing publicly.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Rating</label>
          <Controller
            control={control}
            name="rating"
            render={({ field }) => (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => field.onChange(value)}
                    aria-label={`${value} star${value > 1 ? 's' : ''}`}
                    className="p-1"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        value <= (hoverRating || rating) ? 'star-filled fill-current' : 'text-white/20'
                      }`}
                    />
                  </button>
                ))}
              </div>
            )}
          />
          {errors.rating && <p className="mt-1.5 text-xs text-red-400">{errors.rating.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">
            Your Role / Company <span className="dark:text-txt-secondary text-txt-muted font-normal">(optional)</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Founder, Acme Inc."
            {...register('role')}
            className="form-input w-full px-4 py-3.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark placeholder:dark:text-txt-secondary/50 placeholder:text-txt-muted/50 transition-all duration-300 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Your Review</label>
          <textarea
            rows={4}
            placeholder="Tell us about your experience..."
            {...register('comment')}
            className="form-input w-full px-4 py-3.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark placeholder:dark:text-txt-secondary/50 placeholder:text-txt-muted/50 transition-all duration-300 text-sm resize-none"
          />
          {errors.comment && <p className="mt-1.5 text-xs text-red-400">{errors.comment.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-glow w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>Submit Review</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}

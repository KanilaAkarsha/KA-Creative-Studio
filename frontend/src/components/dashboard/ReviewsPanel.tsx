import { Loader2, Check, X, Trash2, Star } from 'lucide-react';
import { useAllReviews, useReviewModeration } from '../../hooks/useReviews';
import { useToast } from '../../context/ToastContext';
import type { Review } from '../../types';

const STATUS_STYLES: Record<Review['status'], string> = {
  pending: 'bg-amber-500/10 text-amber-400',
  approved: 'bg-emerald-500/10 text-emerald-400',
  rejected: 'bg-red-500/10 text-red-400',
};

export default function ReviewsPanel() {
  const { data: reviews, isLoading } = useAllReviews(true);
  const { updateStatus, remove } = useReviewModeration();
  const { showToast } = useToast();

  const handleApprove = (id: string) => {
    updateStatus.mutate({ id, status: 'approved' }, { onError: (err) => showToast(getErrorMessage(err), 'error') });
  };

  const handleReject = (id: string) => {
    updateStatus.mutate({ id, status: 'rejected' }, { onError: (err) => showToast(getErrorMessage(err), 'error') });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Delete this review permanently?')) return;
    remove.mutate(id, { onError: (err) => showToast(getErrorMessage(err), 'error') });
  };

  return (
    <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !reviews || reviews.length === 0 ? (
        <p className="text-center py-16 dark:text-txt-secondary text-txt-muted text-sm">No reviews yet.</p>
      ) : (
        <div className="divide-y dark:divide-white/5 divide-black/5">
          {reviews.map((review) => (
            <div key={review._id} className="p-6 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm">
                    {review.name}
                  </h3>
                  {review.role && (
                    <span className="text-xs dark:text-txt-secondary text-txt-muted">{review.role}</span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[review.status]}`}
                  >
                    {review.status}
                  </span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-3.5 h-3.5 ${idx < review.rating ? 'star-filled fill-current' : 'text-white/20'}`}
                    />
                  ))}
                </div>
                <p className="text-sm dark:text-txt-secondary text-txt-muted leading-relaxed">{review.comment}</p>
                <p className="text-xs dark:text-txt-secondary text-txt-muted mt-2">
                  {new Date(review.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex sm:flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => handleApprove(review._id)}
                  disabled={updateStatus.isPending || review.status === 'approved'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-40"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleReject(review._id)}
                  disabled={updateStatus.isPending || review.status === 'rejected'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500 hover:text-white transition-all disabled:opacity-40"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={remove.isPending}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg dark:bg-white/5 bg-black/5 dark:text-txt-secondary text-txt-muted text-xs font-medium hover:bg-red-500 hover:text-white transition-all disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getErrorMessage(err: unknown): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    'Something went wrong. Please try again.'
  );
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Review } from '../types';

async function fetchApprovedReviews(): Promise<Review[]> {
  const { data } = await api.get('/reviews');
  return data.data;
}

export function useReviews() {
  return useQuery({
    queryKey: ['reviews', 'approved'],
    queryFn: fetchApprovedReviews,
  });
}

async function submitReview(input: { rating: number; comment: string; role?: string }) {
  const { data } = await api.post('/reviews', input);
  return data as { message: string; data: Review };
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}

async function fetchAllReviews(): Promise<Review[]> {
  const { data } = await api.get('/reviews/all');
  return data.data;
}

export function useAllReviews(enabled: boolean) {
  return useQuery({
    queryKey: ['reviews', 'all'],
    queryFn: fetchAllReviews,
    enabled,
  });
}

async function updateReviewStatus({ id, status }: { id: string; status: Review['status'] }) {
  const { data } = await api.patch(`/reviews/${id}`, { status });
  return data.data as Review;
}

async function deleteReview(id: string) {
  await api.delete(`/reviews/${id}`);
  return id;
}

export function useReviewModeration() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['reviews'] });

  return {
    updateStatus: useMutation({ mutationFn: updateReviewStatus, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteReview, onSuccess: invalidate }),
  };
}

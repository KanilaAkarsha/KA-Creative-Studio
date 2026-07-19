import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';

async function createCheckoutSession(productId: string) {
  const { data } = await api.post('/payments/create-checkout-session', { productId });
  return data.url as string;
}

export function useCheckout() {
  return useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (url) => {
      window.location.href = url;
    },
  });
}

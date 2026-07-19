import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Order } from '../types';

async function fetchMyOrders(): Promise<Order[]> {
  const { data } = await api.get('/orders/me');
  return data.data;
}

export function useMyOrders(enabled: boolean) {
  return useQuery({
    queryKey: ['orders', 'me'],
    queryFn: fetchMyOrders,
    enabled,
    refetchInterval: (query) => {
      // Keep polling briefly if there's a pending order awaiting webhook confirmation.
      const orders = query.state.data;
      return orders?.some((o) => o.status === 'pending') ? 3000 : false;
    },
  });
}

async function fetchDownloadLink(orderId: string) {
  const { data } = await api.get(`/orders/${orderId}/download`);
  return data.data as { title: string; downloadUrl: string };
}

export function useDownloadLink() {
  return useMutation({
    mutationFn: fetchDownloadLink,
  });
}

async function fetchAllOrders(): Promise<Order[]> {
  const { data } = await api.get('/orders');
  return data.data;
}

export function useAllOrders(enabled: boolean) {
  return useQuery({
    queryKey: ['orders', 'all'],
    queryFn: fetchAllOrders,
    enabled,
  });
}

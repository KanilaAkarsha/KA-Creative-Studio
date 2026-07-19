import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface AnalyticsOverview {
  totalRevenue: number;
  totalCompletedOrders: number;
  totalCustomers: number;
  revenueByDay: Array<{ date: string; revenue: number; orders: number }>;
  ordersByProduct: Array<{ title: string; orders: number; revenue: number }>;
  ordersByStatus: Array<{ status: string; count: number }>;
  contactsByStatus: Array<{ status: string; count: number }>;
  contactsByService: Array<{ service: string; count: number }>;
}

async function fetchAnalytics(): Promise<AnalyticsOverview> {
  const { data } = await api.get('/analytics/overview');
  return data.data;
}

export function useAnalytics(enabled: boolean) {
  return useQuery({
    queryKey: ['analytics', 'overview'],
    queryFn: fetchAnalytics,
    enabled,
  });
}

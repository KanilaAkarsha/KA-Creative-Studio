import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Service, ServiceIconKey, ServiceColorKey } from '../types';

async function fetchServices(): Promise<Service[]> {
  const { data } = await api.get('/services');
  return data.data;
}

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });
}

async function fetchServiceMeta(): Promise<{ icons: ServiceIconKey[]; colors: ServiceColorKey[] }> {
  const { data } = await api.get('/services/meta');
  return data.data;
}

export function useServiceMeta() {
  return useQuery({
    queryKey: ['services', 'meta'],
    queryFn: fetchServiceMeta,
    staleTime: Infinity,
  });
}

export type ServiceInput = Omit<Service, '_id' | 'createdAt' | 'active'>;

async function createService(input: Partial<ServiceInput>) {
  const { data } = await api.post('/services', input);
  return data.data as Service;
}

async function updateService({ id, input }: { id: string; input: Partial<ServiceInput> & { active?: boolean } }) {
  const { data } = await api.put(`/services/${id}`, input);
  return data.data as Service;
}

async function deleteService(id: string) {
  await api.delete(`/services/${id}`);
  return id;
}

export function useServiceMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['services'] });

  return {
    create: useMutation({ mutationFn: createService, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateService, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteService, onSuccess: invalidate }),
  };
}

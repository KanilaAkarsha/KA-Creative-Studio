import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { ContactSubmission } from '../types';

async function fetchContacts(): Promise<ContactSubmission[]> {
  const { data } = await api.get('/contact');
  return data.data;
}

export function useContacts(enabled: boolean) {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: fetchContacts,
    enabled,
  });
}

async function updateContactStatus({ id, status }: { id: string; status: ContactSubmission['status'] }) {
  const { data } = await api.patch(`/contact/${id}`, { status });
  return data.data;
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateContactStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

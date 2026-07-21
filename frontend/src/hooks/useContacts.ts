import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { ContactThread } from '../types';

async function submitContact(input: { service: string; message: string; preferredDate?: string }) {
  const { data } = await api.post('/contact', input);
  return data as { message: string; data: ContactThread };
}

export function useSubmitContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

async function fetchMyContacts(): Promise<ContactThread[]> {
  const { data } = await api.get('/contact/me');
  return data.data;
}

export function useMyContacts(enabled: boolean) {
  return useQuery({
    queryKey: ['contacts', 'me'],
    queryFn: fetchMyContacts,
    enabled,
    refetchInterval: enabled ? 20000 : false,
  });
}

async function fetchContacts(): Promise<ContactThread[]> {
  const { data } = await api.get('/contact');
  return data.data;
}

export function useContacts(enabled: boolean) {
  return useQuery({
    queryKey: ['contacts', 'all'],
    queryFn: fetchContacts,
    enabled,
    refetchInterval: enabled ? 20000 : false,
  });
}

async function addReply({ id, text }: { id: string; text: string }) {
  const { data } = await api.post(`/contact/${id}/reply`, { text });
  return data.data as ContactThread;
}

export function useAddReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addReply,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

async function updateContactStatus({ id, status }: { id: string; status: ContactThread['status'] }) {
  const { data } = await api.patch(`/contact/${id}`, { status });
  return data.data as ContactThread;
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
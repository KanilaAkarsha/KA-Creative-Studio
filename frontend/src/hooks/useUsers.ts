import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { AdminUser, UserRole } from '../types';

async function fetchUsers(): Promise<AdminUser[]> {
  const { data } = await api.get('/users');
  return data.data;
}

export function useUsers(enabled: boolean) {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled,
  });
}

async function updateUser({ id, input }: { id: string; input: { role?: UserRole; active?: boolean } }) {
  const { data } = await api.patch(`/users/${id}`, input);
  return data.data as AdminUser;
}

async function deleteUser(id: string) {
  await api.delete(`/users/${id}`);
  return id;
}

export function useUserMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['users'] });

  return {
    update: useMutation({ mutationFn: updateUser, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteUser, onSuccess: invalidate }),
  };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Project } from '../types';

async function fetchProjects(): Promise<Project[]> {
  const { data } = await api.get('/projects');
  return data.data;
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });
}

export type ProjectInput = Omit<Project, '_id' | 'createdAt' | 'active'>;

async function createProject(input: Partial<ProjectInput>) {
  const { data } = await api.post('/projects', input);
  return data.data as Project;
}

async function updateProject({ id, input }: { id: string; input: Partial<ProjectInput> & { active?: boolean } }) {
  const { data } = await api.put(`/projects/${id}`, input);
  return data.data as Project;
}

async function deleteProject(id: string) {
  await api.delete(`/projects/${id}`);
  return id;
}

export function useProjectMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['projects'] });

  return {
    create: useMutation({ mutationFn: createProject, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateProject, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteProject, onSuccess: invalidate }),
  };
}

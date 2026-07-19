import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Product } from '../types';

async function fetchProducts(): Promise<Product[]> {
  const { data } = await api.get('/products');
  return data.data;
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });
}

export type ProductInput = Omit<Product, '_id' | 'createdAt' | 'active'>;

async function createProduct(input: Partial<ProductInput>) {
  const { data } = await api.post('/products', input);
  return data.data as Product;
}

async function updateProduct({ id, input }: { id: string; input: Partial<ProductInput> & { active?: boolean } }) {
  const { data } = await api.put(`/products/${id}`, input);
  return data.data as Product;
}

async function deleteProduct(id: string) {
  await api.delete(`/products/${id}`);
  return id;
}

export function useProductMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['products'] });

  return {
    create: useMutation({ mutationFn: createProduct, onSuccess: invalidate }),
    update: useMutation({ mutationFn: updateProduct, onSuccess: invalidate }),
    remove: useMutation({ mutationFn: deleteProduct, onSuccess: invalidate }),
  };
}

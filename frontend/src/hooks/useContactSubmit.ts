import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { ContactFormValues } from '../lib/validation';

async function submitContactForm(data: ContactFormValues) {
  const response = await api.post('/contact', data);
  return response.data;
}

export function useContactSubmit() {
  return useMutation({
    mutationFn: submitContactForm,
  });
}

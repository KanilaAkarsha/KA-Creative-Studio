import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Loader2, Calendar } from 'lucide-react';
import { contactFormSchema, type ContactFormValues } from '../../lib/validation';
import { useSubmitContact } from '../../hooks/useContacts';
import { useToast } from '../../context/ToastContext';

const SERVICES = ['Graphic Design', 'UI/UX Design', 'Web Development', 'Photography', 'Videography', 'Branding'];

export default function ContactForm() {
  const { showToast } = useToast();
  const mutation = useSubmitContact();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const result = await mutation.mutateAsync(data);
      reset();
      showToast(result.message, 'success');
    } catch (err) {
      const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Something went wrong. Please try again.';
      showToast(message, 'error');
    }
  };

  const busy = isSubmitting || mutation.isPending;
  const today = new Date().toISOString().split('T')[0];

  return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Service Needed</label>
            <select
                defaultValue=""
                {...register('service')}
                className="form-input w-full px-4 py-3.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark transition-all duration-300 text-sm appearance-none cursor-pointer"
            >
              <option value="" disabled className="dark:text-txt-secondary text-txt-muted">
                Select a service
              </option>
              {SERVICES.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
              ))}
            </select>
            {errors.service && <p className="mt-1.5 text-xs text-red-400">{errors.service.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">
              Preferred Date <span className="dark:text-txt-secondary text-txt-muted font-normal">(optional)</span>
            </label>
            <div className="relative">
              <input
                  type="date"
                  min={today}
                  {...register('preferredDate')}
                  className="form-input w-full px-4 py-3.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark transition-all duration-300 text-sm [color-scheme:dark]"
              />
              <Calendar className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none dark:text-txt-secondary text-txt-muted" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Your Message</label>
          <textarea
              rows={5}
              placeholder="Tell me about your project..."
              {...register('message')}
              className="form-input w-full px-4 py-3.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark placeholder:dark:text-txt-secondary/50 placeholder:text-txt-muted/50 transition-all duration-300 text-sm resize-none"
          />
          {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message.message}</p>}
        </div>

        <button
            type="submit"
            disabled={busy}
            className="btn-glow w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {busy ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
          ) : (
              <>
                <span>Send Message</span>
                <Send className="w-4 h-4" />
              </>
          )}
        </button>
      </form>
  );
}
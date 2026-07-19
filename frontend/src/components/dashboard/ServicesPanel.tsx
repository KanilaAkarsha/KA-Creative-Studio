import { useState } from 'react';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import Modal from '../common/Modal';
import { useServices, useServiceMutations, useServiceMeta } from '../../hooks/useServices';
import { SERVICE_ICON_MAP, SERVICE_COLOR_MAP } from '../../lib/serviceTheme';
import { useToast } from '../../context/ToastContext';
import type { Service, ServiceColorKey, ServiceIconKey } from '../../types';

const EMPTY_FORM = {
  title: '',
  description: '',
  longDescription: '',
  featuresText: '',
  startingPrice: '',
  icon: 'Sparkles' as ServiceIconKey,
  color: 'primary' as ServiceColorKey,
};

export default function ServicesPanel() {
  const { data: services, isLoading } = useServices();
  const { data: meta } = useServiceMeta();
  const { create, update, remove } = useServiceMutations();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingId(service._id);
    setForm({
      title: service.title,
      description: service.description,
      longDescription: service.longDescription,
      featuresText: service.features.join('\n'),
      startingPrice: service.startingPrice,
      icon: service.icon,
      color: service.color,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      title: form.title,
      description: form.description,
      longDescription: form.longDescription,
      features: form.featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
      startingPrice: form.startingPrice,
      icon: form.icon,
      color: form.color,
    };
    try {
      if (editingId) {
        await update.mutateAsync({ id: editingId, input });
        showToast('Service updated.', 'success');
      } else {
        await create.mutateAsync(input);
        showToast('Service created.', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await remove.mutateAsync(id);
      showToast('Service deleted.', 'success');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const isSaving = create.isPending || update.isPending;
  const icons = meta?.icons ?? Object.keys(SERVICE_ICON_MAP);
  const colors = meta?.colors ?? Object.keys(SERVICE_COLOR_MAP);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !services || services.length === 0 ? (
          <p className="text-center py-16 dark:text-txt-secondary text-txt-muted text-sm">No services yet.</p>
        ) : (
          <div className="divide-y dark:divide-white/5 divide-black/5">
            {services.map((service) => {
              const Icon = SERVICE_ICON_MAP[service.icon];
              const theme = SERVICE_COLOR_MAP[service.color];
              return (
                <div key={service._id} className="p-4 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${theme.bgGradientClass} ${theme.borderColorClass}`}
                  >
                    <Icon className={`w-5 h-5 ${theme.iconColorClass}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm">
                      {service.title}
                    </h3>
                    <p className="text-xs dark:text-txt-secondary text-txt-muted truncate">{service.description}</p>
                  </div>
                  <span className="text-xs font-medium dark:text-txt-secondary text-txt-muted flex-shrink-0">
                    {service.startingPrice}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openEdit(service)}
                      className="w-8 h-8 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id, service.title)}
                      className="w-8 h-8 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="font-heading font-bold text-2xl dark:text-txt-primary text-txt-dark mb-6">
          {editingId ? 'Edit Service' : 'Add Service'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">
              Short Description
            </label>
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">
              Full Description (shown in "Learn More")
            </label>
            <textarea
              required
              rows={3}
              value={form.longDescription}
              onChange={(e) => setForm((f) => ({ ...f, longDescription: e.target.value }))}
              className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">
              Features (one per line)
            </label>
            <textarea
              rows={4}
              value={form.featuresText}
              onChange={(e) => setForm((f) => ({ ...f, featuresText: e.target.value }))}
              className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">
                Starting Price
              </label>
              <input
                required
                placeholder="From $500"
                value={form.startingPrice}
                onChange={(e) => setForm((f) => ({ ...f, startingPrice: e.target.value }))}
                className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Icon</label>
              <select
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value as ServiceIconKey }))}
                className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
              >
                {icons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Color</label>
              <select
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value as ServiceColorKey }))}
                className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm capitalize"
              >
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-glow w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold transition-all duration-300 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{editingId ? 'Save Changes' : 'Create Service'}</span>}
          </button>
        </form>
      </Modal>
    </div>
  );
}

function getErrorMessage(err: unknown): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    'Something went wrong. Please try again.'
  );
}

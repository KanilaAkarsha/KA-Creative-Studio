import { useState } from 'react';
import { Loader2, Plus, Pencil, Trash2, Star } from 'lucide-react';
import Modal from '../common/Modal';
import { useProjects, useProjectMutations } from '../../hooks/useProjects';
import { useToast } from '../../context/ToastContext';
import type { Project } from '../../types';

const CATEGORIES = ['Branding', 'Web Design', 'Photography', 'UI/UX', 'Videography'];

const EMPTY_FORM = {
  title: '',
  slug: '',
  description: '',
  category: CATEGORIES[0],
  image: '',
  span: 'normal' as 'normal' | 'large',
  featured: false,
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProjectsPanel() {
  const { data: projects, isLoading } = useProjects();
  const { create, update, remove } = useProjectMutations();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      category: project.category,
      image: project.image,
      span: project.span,
      featured: project.featured,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await update.mutateAsync({ id: editingId, input: form });
        showToast('Project updated.', 'success');
      } else {
        await create.mutateAsync(form);
        showToast('Project created.', 'success');
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
      showToast('Project deleted.', 'success');
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const isSaving = create.isPending || update.isPending;

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !projects || projects.length === 0 ? (
          <p className="text-center py-16 dark:text-txt-secondary text-txt-muted text-sm">No projects yet.</p>
        ) : (
          <div className="divide-y dark:divide-white/5 divide-black/5">
            {projects.map((project) => (
              <div key={project._id} className="p-4 flex items-center gap-4">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm">
                      {project.title}
                    </h3>
                    {project.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />}
                    <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-medium">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-xs dark:text-txt-secondary text-txt-muted truncate">{project.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(project)}
                    className="w-8 h-8 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id, project.title)}
                    className="w-8 h-8 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="font-heading font-bold text-2xl dark:text-txt-primary text-txt-dark mb-6">
          {editingId ? 'Edit Project' : 'Add Project'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({ ...f, title, slug: editingId ? f.slug : slugify(title) }));
              }}
              className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Slug</label>
            <input
              required
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Description</label>
            <textarea
              required
              rows={2}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Layout</label>
              <select
                value={form.span}
                onChange={(e) => setForm((f) => ({ ...f, span: e.target.value as 'normal' | 'large' }))}
                className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
              >
                <option value="normal">Normal</option>
                <option value="large">Large (featured spotlight)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Image URL</label>
            <input
              required
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
            />
          </div>
          <label className="flex items-center gap-2 text-sm dark:text-txt-primary text-txt-dark">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              className="w-4 h-4 rounded accent-primary"
            />
            <span>Show in homepage "Featured Works"</span>
          </label>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-glow w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold transition-all duration-300 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{editingId ? 'Save Changes' : 'Create Project'}</span>}
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

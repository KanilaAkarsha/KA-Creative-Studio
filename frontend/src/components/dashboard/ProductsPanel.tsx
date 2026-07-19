import { useState } from 'react';
import { Loader2, Plus, Pencil, EyeOff } from 'lucide-react';
import Modal from '../common/Modal';
import { useProducts, useProductMutations } from '../../hooks/useProducts';
import { useToast } from '../../context/ToastContext';
import type { Product } from '../../types';

const EMPTY_FORM = {
  slug: '',
  title: '',
  description: '',
  category: '',
  price: 0,
  image: '',
  downloadUrl: '',
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function ProductsPanel() {
  const { data: products, isLoading } = useProducts();
  const { create, update, remove } = useProductMutations();
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      slug: product.slug,
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price,
      image: product.image,
      downloadUrl: product.downloadUrl,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await update.mutateAsync({ id: editingId, input: form });
        showToast('Product updated.', 'success');
      } else {
        await create.mutateAsync(form);
        showToast('Product created.', 'success');
      }
      setModalOpen(false);
    } catch (err) {
      showToast(getErrorMessage(err), 'error');
    }
  };

  const handleDeactivate = async (id: string, title: string) => {
    if (!window.confirm(`Remove "${title}" from the shop? Customers who already bought it keep their download.`)) {
      return;
    }
    try {
      await remove.mutateAsync(id);
      showToast('Product removed from shop.', 'success');
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
          <span>Add Product</span>
        </button>
      </div>

      <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : !products || products.length === 0 ? (
          <p className="text-center py-16 dark:text-txt-secondary text-txt-muted text-sm">No products yet.</p>
        ) : (
          <div className="divide-y dark:divide-white/5 divide-black/5">
            {products.map((product) => (
              <div key={product._id} className="p-4 flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm">
                      {product.title}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                      {product.category}
                    </span>
                  </div>
                  <p className="text-xs dark:text-txt-secondary text-txt-muted truncate">{product.description}</p>
                </div>
                <span className="text-sm font-heading font-bold dark:text-txt-primary text-txt-dark flex-shrink-0">
                  ${product.price}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(product)}
                    className="w-8 h-8 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-primary transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeactivate(product._id, product.title)}
                    title="Remove from shop"
                    className="w-8 h-8 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-red-400 transition-colors"
                  >
                    <EyeOff className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <h3 className="font-heading font-bold text-2xl dark:text-txt-primary text-txt-dark mb-6">
          {editingId ? 'Edit Product' : 'Add Product'}
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
              <input
                required
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">Price (USD)</label>
              <input
                required
                type="number"
                min={0}
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
              />
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
          <div>
            <label className="block text-sm font-medium dark:text-txt-primary text-txt-dark mb-2">
              Download URL
            </label>
            <input
              required
              value={form.downloadUrl}
              onChange={(e) => setForm((f) => ({ ...f, downloadUrl: e.target.value }))}
              className="form-input w-full px-4 py-3 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-glow w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold transition-all duration-300 disabled:opacity-70"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>{editingId ? 'Save Changes' : 'Create Product'}</span>}
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

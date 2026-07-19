import { Loader2, ShieldCheck, User, Ban, CheckCircle2, Trash2 } from 'lucide-react';
import { useUsers, useUserMutations } from '../../hooks/useUsers';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function UsersPanel() {
  const { data: users, isLoading } = useUsers(true);
  const { update, remove } = useUserMutations();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const handleToggleRole = (id: string, currentRole: string) => {
    update.mutate(
      { id, input: { role: currentRole === 'admin' ? 'customer' : 'admin' } },
      { onError: (err) => showToast(getErrorMessage(err), 'error') }
    );
  };

  const handleToggleActive = (id: string, active: boolean) => {
    update.mutate(
      { id, input: { active: !active } },
      { onError: (err) => showToast(getErrorMessage(err), 'error') }
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}'s account? This cannot be undone.`)) return;
    remove.mutate(id, { onError: (err) => showToast(getErrorMessage(err), 'error') });
  };

  return (
    <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !users || users.length === 0 ? (
        <p className="text-center py-16 dark:text-txt-secondary text-txt-muted text-sm">No users yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-white/5 border-black/5 text-left">
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Name</th>
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Email</th>
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Role</th>
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Status</th>
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Joined</th>
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u._id === currentUser?.id;
                return (
                  <tr key={u._id} className="border-b dark:border-white/5 border-black/5 last:border-0">
                    <td className="p-4 dark:text-txt-primary text-txt-dark">
                      {u.name}
                      {u.googleId && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-txt-muted">
                          Google
                        </span>
                      )}
                      {isSelf && <span className="ml-2 text-[10px] text-primary">(you)</span>}
                    </td>
                    <td className="p-4 dark:text-txt-secondary text-txt-muted">{u.email}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide capitalize ${
                          u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                          u.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {u.active ? 'active' : 'deactivated'}
                      </span>
                    </td>
                    <td className="p-4 dark:text-txt-secondary text-txt-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRole(u._id, u.role)}
                          disabled={isSelf || update.isPending}
                          title={u.role === 'admin' ? 'Demote to customer' : 'Promote to admin'}
                          className="w-8 h-8 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-accent transition-colors disabled:opacity-30"
                        >
                          {u.role === 'admin' ? <User className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleToggleActive(u._id, u.active)}
                          disabled={isSelf || update.isPending}
                          title={u.active ? 'Deactivate account' : 'Reactivate account'}
                          className="w-8 h-8 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-amber-400 transition-colors disabled:opacity-30"
                        >
                          {u.active ? <Ban className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          disabled={isSelf || remove.isPending}
                          title="Delete account"
                          className="w-8 h-8 rounded-lg dark:bg-white/5 bg-black/5 flex items-center justify-center dark:text-txt-secondary text-txt-muted hover:text-red-400 transition-colors disabled:opacity-30"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function getErrorMessage(err: unknown): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
    'Something went wrong. Please try again.'
  );
}

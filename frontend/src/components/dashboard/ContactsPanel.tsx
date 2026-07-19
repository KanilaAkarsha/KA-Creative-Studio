import { Loader2, Check, Archive } from 'lucide-react';
import { useContacts, useUpdateContactStatus } from '../../hooks/useContacts';
import type { ContactSubmission } from '../../types';

const STATUS_STYLES: Record<ContactSubmission['status'], string> = {
  new: 'bg-primary/10 text-primary',
  read: 'bg-amber-500/10 text-amber-400',
  archived: 'bg-white/5 text-txt-muted',
};

export default function ContactsPanel() {
  const { data: contacts, isLoading } = useContacts(true);
  const updateStatus = useUpdateContactStatus();

  return (
    <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !contacts || contacts.length === 0 ? (
        <p className="text-center py-16 dark:text-txt-secondary text-txt-muted text-sm">No messages yet.</p>
      ) : (
        <div className="divide-y dark:divide-white/5 divide-black/5">
          {contacts.map((contact) => (
            <div key={contact._id} className="p-6 flex flex-col sm:flex-row sm:items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm">
                    {contact.name}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[contact.status]}`}
                  >
                    {contact.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-medium">
                    {contact.service}
                  </span>
                </div>
                <p className="text-xs dark:text-txt-secondary text-txt-muted mb-2">{contact.email}</p>
                <p className="text-sm dark:text-txt-secondary text-txt-muted leading-relaxed">{contact.message}</p>
                <p className="text-xs dark:text-txt-secondary text-txt-muted mt-2">
                  {new Date(contact.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex sm:flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => updateStatus.mutate({ id: contact._id, status: 'read' })}
                  disabled={updateStatus.isPending || contact.status === 'read'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-40"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Read</span>
                </button>
                <button
                  onClick={() => updateStatus.mutate({ id: contact._id, status: 'archived' })}
                  disabled={updateStatus.isPending || contact.status === 'archived'}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg dark:bg-white/5 bg-black/5 dark:text-txt-secondary text-txt-muted text-xs font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-40"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

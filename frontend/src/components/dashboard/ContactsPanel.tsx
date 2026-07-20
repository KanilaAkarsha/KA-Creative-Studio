import { useState } from 'react';
import { Loader2, Archive, Send, Calendar } from 'lucide-react';
import { useContacts, useUpdateContactStatus, useAddReply } from '../../hooks/useContacts';
import { useToast } from '../../context/ToastContext';
import type { ContactThread } from '../../types';

const STATUS_STYLES: Record<ContactThread['status'], string> = {
  new: 'bg-primary/10 text-primary',
  read: 'bg-cyan-500/10 text-cyan-400',
  replied: 'bg-emerald-500/10 text-emerald-400',
  archived: 'bg-white/5 text-txt-muted',
};

function ThreadRow({ thread }: { thread: ContactThread }) {
  const [replyText, setReplyText] = useState('');
  const addReply = useAddReply();
  const updateStatus = useUpdateContactStatus();
  const { showToast } = useToast();
  const customer = typeof thread.user === 'object' ? thread.user : null;

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    try {
      await addReply.mutateAsync({ id: thread._id, text: replyText.trim() });
      setReplyText('');
    } catch (err) {
      const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Could not send reply. Please try again.';
      showToast(message, 'error');
    }
  };

  return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm">
            {thread.name}
          </h3>
          <span className="text-xs dark:text-txt-secondary text-txt-muted">{thread.email}</span>
          <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${STATUS_STYLES[thread.status]}`}
          >
          {thread.status}
        </span>
          <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-medium">
          {thread.service}
        </span>
          {thread.preferredDate && (
              <span className="flex items-center gap-1 text-xs dark:text-txt-secondary text-txt-muted">
            <Calendar className="w-3 h-3" />
                {new Date(thread.preferredDate).toLocaleDateString()}
          </span>
          )}
        </div>

        <div className="space-y-2 mb-3 max-h-64 overflow-y-auto">
          {thread.messages.map((msg) => (
              <div key={msg._id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                <div
                    className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                        msg.sender === 'admin'
                            ? 'bg-gradient-to-r from-primary to-accent text-white'
                            : 'dark:bg-white/5 bg-black/5 dark:text-txt-primary text-txt-dark'
                    }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <p
                      className={`text-[10px] mt-1 ${msg.sender === 'admin' ? 'text-white/70' : 'dark:text-txt-secondary text-txt-muted'}`}
                  >
                    {msg.sender === 'admin' ? 'You' : thread.name} ·{' '}
                    {new Date(msg.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleReply} className="flex-1 flex gap-2">
            <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Reply to this customer..."
                className="form-input flex-1 px-4 py-2.5 rounded-xl dark:bg-dark-surface bg-light-surface border dark:border-white/10 border-black/10 dark:text-txt-primary text-txt-dark placeholder:dark:text-txt-secondary/50 placeholder:text-txt-muted/50 text-sm"
            />
            <button
                type="submit"
                disabled={addReply.isPending || !replyText.trim()}
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-r from-primary to-accent text-white flex-shrink-0 disabled:opacity-60"
            >
              {addReply.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
          <button
              onClick={() => updateStatus.mutate({ id: thread._id, status: 'archived' })}
              disabled={updateStatus.isPending || thread.status === 'archived'}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl dark:bg-white/5 bg-black/5 dark:text-txt-secondary text-txt-muted text-xs font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-40 flex-shrink-0"
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archive</span>
          </button>
        </div>
      </div>
  );
}

export default function ContactsPanel() {
  const { data: threads, isLoading } = useContacts(true);

  return (
      <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden">
        {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        ) : !threads || threads.length === 0 ? (
            <p className="text-center py-16 dark:text-txt-secondary text-txt-muted text-sm">No messages yet.</p>
        ) : (
            <div className="divide-y dark:divide-white/5 divide-black/5">
              {threads.map((thread) => (
                  <ThreadRow key={thread._id} thread={thread} />
              ))}
            </div>
        )}
      </div>
  );
}
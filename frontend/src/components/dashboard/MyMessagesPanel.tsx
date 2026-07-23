import { useState } from 'react';
import { Loader2, Mail, Send, Calendar } from 'lucide-react';
import { useMyContacts, useAddReply } from '../../hooks/useContacts';
import { useToast } from '../../context/ToastContext';
import type { ContactThread } from '../../types';

const STATUS_META: Record<ContactThread['status'], { label: string; className: string }> = {
    new: { label: 'sent', className: 'bg-primary/10 text-primary' },
    read: { label: 'seen', className: 'bg-cyan-500/10 text-cyan-400' },
    replied: { label: 'replied', className: 'bg-emerald-500/10 text-emerald-400' },
    archived: { label: 'closed', className: 'bg-white/5 text-txt-muted' },
};

function ThreadCard({ thread }: { thread: ContactThread }) {
    const [replyText, setReplyText] = useState('');
    const addReply = useAddReply();
    const { showToast } = useToast();
    const meta = STATUS_META[thread.status];

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            await addReply.mutateAsync({ id: thread._id, text: replyText.trim() });
            setReplyText('');
        } catch (err) {
            const message =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Could not send your reply. Please try again.';
            showToast(message, 'error');
        }
    };

    return (
        <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden">
            <div className="p-5 border-b dark:border-white/5 border-black/5 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-medium">
            {thread.service}
          </span>
                    <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${meta.className}`}
                    >
            {meta.label}
          </span>
                </div>
                <span className="text-xs dark:text-txt-secondary text-txt-muted">
          {new Date(thread.createdAt).toLocaleDateString()}
        </span>
            </div>

            {thread.preferredDate && (
                <div className="px-5 pt-4">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 w-fit">
                        <Calendar className="w-4 h-4 text-amber-400 flex-shrink-0" />
                        <span className="text-xs font-medium text-amber-400">
              Your requested date:{' '}
                            {new Date(thread.preferredDate).toLocaleDateString(undefined, {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
            </span>
                    </div>
                </div>
            )}

            <div className="p-5 space-y-3 max-h-80 overflow-y-auto">
                {thread.messages.map((msg) => (
                    <div key={msg._id} className={`flex ${msg.sender === 'admin' ? 'justify-start' : 'justify-end'}`}>
                        <div
                            className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                                msg.sender === 'admin'
                                    ? 'dark:bg-white/5 bg-black/5 dark:text-txt-primary text-txt-dark'
                                    : 'bg-gradient-to-r from-primary to-accent text-white'
                            }`}
                        >
                            <p className="leading-relaxed">{msg.text}</p>
                            <p
                                className={`text-[10px] mt-1 ${msg.sender === 'admin' ? 'dark:text-txt-secondary text-txt-muted' : 'text-white/70'}`}
                            >
                                {msg.sender === 'admin' ? 'KA Studio' : 'You'} ·{' '}
                                {new Date(msg.createdAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {thread.status !== 'archived' && (
                <form onSubmit={handleReply} className="p-4 border-t dark:border-white/5 border-black/5 flex gap-2">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a follow-up..."
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
            )}
        </div>
    );
}

export default function MyMessagesPanel() {
    const { data: threads, isLoading } = useMyContacts(true);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!threads || threads.length === 0) {
        return (
            <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl dark:text-txt-primary text-txt-dark mb-2">
                    No messages yet
                </h3>
                <p className="dark:text-txt-secondary text-txt-muted text-sm max-w-sm mx-auto">
                    Send a message from the Contact section on the homepage to start a conversation.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {threads.map((thread) => (
                <ThreadCard key={thread._id} thread={thread} />
            ))}
        </div>
    );
}
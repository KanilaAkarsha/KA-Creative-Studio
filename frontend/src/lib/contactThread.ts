import type { ContactThread } from '../types';

/**
 * A thread is "awaiting reply" from a given viewer when the most recent
 * message came from the *other* party and the thread isn't archived.
 * - For an admin viewer: true when the customer sent the last message.
 * - For a customer viewer: true when the admin sent the last message.
 */
export function isAwaitingReply(thread: ContactThread, viewer: 'admin' | 'user'): boolean {
    if (thread.status === 'archived') return false;
    const lastMessage = thread.messages[thread.messages.length - 1];
    if (!lastMessage) return false;
    const otherSender = viewer === 'admin' ? 'user' : 'admin';
    return lastMessage.sender === otherSender;
}

export function countAwaitingReply(threads: ContactThread[] | undefined, viewer: 'admin' | 'user'): number {
    if (!threads) return 0;
    return threads.filter((t) => isAwaitingReply(t, viewer)).length;
}
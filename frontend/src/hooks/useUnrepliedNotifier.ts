import { useEffect, useRef } from 'react';
import { useToast } from '../context/ToastContext';
import type { ContactThread } from '../types';
import { countAwaitingReply } from '../lib/contactThread';

export function useUnrepliedNotifier(
    threads: ContactThread[] | undefined,
    viewer: 'admin' | 'user'
): number {
    const { showToast } = useToast();
    const previousCount = useRef<number | null>(null);
    const count = countAwaitingReply(threads, viewer);

    useEffect(() => {
        if (threads === undefined) return; // still loading

        if (previousCount.current !== null && count > previousCount.current) {
            const diff = count - previousCount.current;
            const label = viewer === 'admin' ? 'message' : 'reply';
            showToast(
                diff === 1
                    ? `You have a new ${label} awaiting a reply.`
                    : `You have ${diff} new ${label}s awaiting a reply.`,
                'info'
            );
        }

        previousCount.current = count;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [count, threads === undefined]);

    return count;
}
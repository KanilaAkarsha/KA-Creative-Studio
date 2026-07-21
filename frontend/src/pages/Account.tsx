import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Download, Package, Loader2, Clock, XCircle, ShoppingBag, Mail } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import MyMessagesPanel from '../components/dashboard/MyMessagesPanel';
import { useMyOrders, useDownloadLink } from '../hooks/useOrders';
import { useMyContacts } from '../hooks/useContacts';
import { useUnrepliedNotifier } from '../hooks/useUnrepliedNotifier';
import { useToast } from '../context/ToastContext';
import type { Order } from '../types';

function getProductImage(order: Order) {
    return typeof order.product === 'object' ? order.product.image : undefined;
}

const STATUS_META: Record<Order['status'], { label: string; className: string }> = {
    completed: { label: 'completed', className: 'bg-emerald-500/10 text-emerald-400' },
    pending: { label: 'processing', className: 'bg-amber-500/10 text-amber-400' },
    refunded: { label: 'refunded', className: 'bg-white/5 text-txt-muted' },
    failed: { label: 'failed', className: 'bg-red-500/10 text-red-400' },
};

type Tab = 'purchases' | 'messages';

function PurchasesTab() {
    const { data: orders, isLoading } = useMyOrders(true);
    const downloadMutation = useDownloadLink();
    const { showToast } = useToast();

    const handleDownload = async (orderId: string) => {
        try {
            const result = await downloadMutation.mutateAsync(orderId);
            window.open(result.downloadUrl, '_blank', 'noopener,noreferrer');
        } catch {
            showToast('Could not generate a download link. Please try again.', 'error');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
        );
    }

    if (!orders || orders.length === 0) {
        return (
            <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Package className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-xl dark:text-txt-primary text-txt-dark mb-2">
                    No purchases yet
                </h3>
                <p className="dark:text-txt-secondary text-txt-muted text-sm max-w-sm mx-auto">
                    Once you buy a digital product from the shop, it'll show up here with a download link.
                </p>
            </div>
        );
    }

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => {
                const meta = STATUS_META[order.status];
                return (
                    <div
                        key={order._id}
                        className="card-hover gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden"
                    >
                        {getProductImage(order) && (
                            <img src={getProductImage(order)} alt={order.title} className="w-full h-40 object-cover" />
                        )}
                        <div className="p-5">
                            <div className="flex items-center justify-between mb-2">
                <span
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${meta.className}`}
                >
                  {meta.label}
                </span>
                                <span className="text-xs dark:text-txt-secondary text-txt-muted">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                            </div>
                            <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark text-sm mb-1">
                                {order.title}
                            </h3>
                            <p className="text-xs dark:text-txt-secondary text-txt-muted mb-4">${order.price}</p>

                            {order.status === 'completed' && (
                                <button
                                    onClick={() => handleDownload(order._id)}
                                    disabled={downloadMutation.isPending}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary text-sm font-medium hover:bg-primary hover:text-white transition-all duration-300 disabled:opacity-60"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>Download</span>
                                </button>
                            )}
                            {order.status === 'pending' && (
                                <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-medium">
                                    <Clock className="w-4 h-4 animate-pulse" />
                                    <span>Confirming payment...</span>
                                </div>
                            )}
                            {(order.status === 'failed' || order.status === 'refunded') && (
                                <div className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white/5 text-txt-muted text-sm font-medium">
                                    <XCircle className="w-4 h-4" />
                                    <span>{order.status === 'failed' ? 'Payment failed' : 'Refunded'}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default function Account() {
    const [tab, setTab] = useState<Tab>('purchases');
    const [searchParams, setSearchParams] = useSearchParams();
    const { showToast } = useToast();

    // Kept mounted here (not just inside MyMessagesPanel) so the unreplied
    // count and new-reply toast keep working no matter which tab is active.
    const { data: threads } = useMyContacts(true);
    const unrepliedCount = useUnrepliedNotifier(threads, 'user');

    useEffect(() => {
        const checkout = searchParams.get('checkout');
        if (checkout === 'success') {
            showToast('Payment received! Your order is being confirmed — this usually takes a few seconds.', 'success');
            searchParams.delete('checkout');
            searchParams.delete('session_id');
            setSearchParams(searchParams, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DashboardLayout title="My Account" subtitle="Your purchases, downloads, and messages, all in one place.">
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setTab('purchases')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        tab === 'purchases'
                            ? 'bg-gradient-to-r from-primary to-accent text-white'
                            : 'dark:bg-white/5 bg-black/5 dark:text-txt-secondary text-txt-muted'
                    }`}
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Purchases</span>
                </button>
                <button
                    onClick={() => setTab('messages')}
                    className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                        tab === 'messages'
                            ? 'bg-gradient-to-r from-primary to-accent text-white'
                            : 'dark:bg-white/5 bg-black/5 dark:text-txt-secondary text-txt-muted'
                    }`}
                >
                    <Mail className="w-4 h-4" />
                    <span>Messages</span>
                    {unrepliedCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unrepliedCount > 9 ? '9+' : unrepliedCount}
            </span>
                    )}
                </button>
            </div>

            {tab === 'purchases' ? <PurchasesTab /> : <MyMessagesPanel />}
        </DashboardLayout>
    );
}
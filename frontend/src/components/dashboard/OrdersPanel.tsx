import { Loader2 } from 'lucide-react';
import { useAllOrders } from '../../hooks/useOrders';
import type { Order } from '../../types';

const ORDER_STATUS_STYLES: Record<Order['status'], string> = {
  completed: 'bg-emerald-500/10 text-emerald-400',
  pending: 'bg-amber-500/10 text-amber-400',
  refunded: 'bg-white/5 text-txt-muted',
  failed: 'bg-red-500/10 text-red-400',
};

export default function OrdersPanel() {
  const { data: orders, isLoading } = useAllOrders(true);

  return (
    <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 overflow-hidden">
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : !orders || orders.length === 0 ? (
        <p className="text-center py-16 dark:text-txt-secondary text-txt-muted text-sm">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-white/5 border-black/5 text-left">
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Customer</th>
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Product</th>
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Price</th>
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Status</th>
                <th className="p-4 font-medium dark:text-txt-secondary text-txt-muted">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const customer = typeof order.user === 'object' ? order.user : null;
                return (
                  <tr key={order._id} className="border-b dark:border-white/5 border-black/5 last:border-0">
                    <td className="p-4 dark:text-txt-primary text-txt-dark">
                      {customer?.name}
                      <div className="text-xs dark:text-txt-secondary text-txt-muted">{customer?.email}</div>
                    </td>
                    <td className="p-4 dark:text-txt-primary text-txt-dark">{order.title}</td>
                    <td className="p-4 dark:text-txt-primary text-txt-dark">${order.price}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 dark:text-txt-secondary text-txt-muted">
                      {new Date(order.createdAt).toLocaleDateString()}
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

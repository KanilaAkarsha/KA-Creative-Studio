import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';
import type { ToastItem } from '../../context/ToastContext';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: 'from-emerald-500 to-emerald-600',
  error: 'from-red-500 to-red-600',
  info: 'from-primary to-accent',
};

export default function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="fixed top-24 right-4 z-[90] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="glass rounded-xl px-5 py-4 flex items-center gap-3 min-w-[300px] max-w-[400px]"
            >
              <div
                className={`w-8 h-8 rounded-lg bg-gradient-to-br ${COLORS[toast.type]} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-medium dark:text-txt-primary text-txt-dark">{toast.message}</p>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

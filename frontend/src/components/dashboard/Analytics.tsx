import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { DollarSign, ShoppingCart, Users, Loader2 } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';

const PRIMARY = '#3B82F6';
const ACCENT = '#8B5CF6';
const PIE_COLORS = [PRIMARY, ACCENT, '#F59E0B', '#10B981', '#EF4444', '#64748B'];

function formatDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Analytics() {
  const { data, isLoading } = useAnalytics(true);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const chartData = data.revenueByDay.map((d) => ({ ...d, label: formatDateLabel(d.date) }));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm dark:text-txt-secondary text-txt-muted">Total Revenue</span>
          </div>
          <div className="font-heading text-3xl font-bold gradient-text">${data.totalRevenue}</div>
        </div>
        <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-accent" />
            </div>
            <span className="text-sm dark:text-txt-secondary text-txt-muted">Completed Orders</span>
          </div>
          <div className="font-heading text-3xl font-bold gradient-text">{data.totalCompletedOrders}</div>
        </div>
        <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm dark:text-txt-secondary text-txt-muted">Total Customers</span>
          </div>
          <div className="font-heading text-3xl font-bold gradient-text">{data.totalCustomers}</div>
        </div>
      </div>

      {/* Revenue over time */}
      <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-6">
        <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark mb-4">
          Revenue — Last 30 Days
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={PRIMARY} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{
                  background: '#111827',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#F8FAFC' }}
              />
              <Area type="monotone" dataKey="revenue" stroke={PRIMARY} strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Orders by product */}
        <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-6">
          <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark mb-4">
            Top Products by Revenue
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ordersByProduct} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" vertical={false} />
                <XAxis
                  dataKey="title"
                  tick={{ fontSize: 10, fill: '#94A3B8' }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{
                    background: '#111827',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#F8FAFC' }}
                />
                <Bar dataKey="revenue" fill={ACCENT} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Contacts by service */}
        <div className="gradient-border rounded-2xl dark:bg-dark-surface/80 bg-light-surface/80 p-6">
          <h3 className="font-heading font-semibold dark:text-txt-primary text-txt-dark mb-4">
            Inquiries by Service
          </h3>
          <div className="h-72">
            {data.contactsByService.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm dark:text-txt-secondary text-txt-muted">
                No contact submissions yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.contactsByService}
                    dataKey="count"
                    nameKey="service"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={90}
                    paddingAngle={2}
                  >
                    {data.contactsByService.map((entry, idx) => (
                      <Cell key={entry.service} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: '#111827',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

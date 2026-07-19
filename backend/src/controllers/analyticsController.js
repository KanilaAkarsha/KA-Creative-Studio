import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';

// @desc    Get aggregated analytics for the admin dashboard
// @route   GET /api/analytics/overview
// @access  Private (admin)
export const getOverview = asyncHandler(async (req, res) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const [
    revenueTotalsAgg,
    revenueByDayAgg,
    ordersByProductAgg,
    ordersByStatusAgg,
    contactsByStatusAgg,
    contactsByServiceAgg,
    totalCustomers,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$price' }, totalCompletedOrders: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { status: 'completed', createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$price' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: '$title', orders: { $sum: 1 }, revenue: { $sum: '$price' } } },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]),
    Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Contact.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Contact.aggregate([{ $group: { _id: '$service', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    User.countDocuments({ role: 'customer' }),
  ]);

  // Fill in every day of the last 30 days (including zero-order days) so the
  // chart doesn't have gaps.
  const revenueByDayMap = new Map(revenueByDayAgg.map((d) => [d._id, d]));
  const revenueByDay = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date(thirtyDaysAgo);
    date.setDate(date.getDate() + i);
    const key = date.toISOString().slice(0, 10);
    const entry = revenueByDayMap.get(key);
    revenueByDay.push({
      date: key,
      revenue: entry?.revenue ?? 0,
      orders: entry?.orders ?? 0,
    });
  }

  const totals = revenueTotalsAgg[0] || { totalRevenue: 0, totalCompletedOrders: 0 };

  res.status(200).json({
    success: true,
    data: {
      totalRevenue: totals.totalRevenue,
      totalCompletedOrders: totals.totalCompletedOrders,
      totalCustomers,
      revenueByDay,
      ordersByProduct: ordersByProductAgg.map((p) => ({ title: p._id, orders: p.orders, revenue: p.revenue })),
      ordersByStatus: ordersByStatusAgg.map((s) => ({ status: s._id, count: s.count })),
      contactsByStatus: contactsByStatusAgg.map((c) => ({ status: c._id, count: c.count })),
      contactsByService: contactsByServiceAgg.map((c) => ({ service: c._id, count: c.count })),
    },
  });
});

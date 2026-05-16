const Order = require('../models/Order');
const User = require('../models/User');
const Medicine = require('../models/Medicine');
const Prescription = require('../models/Prescription');

exports.getSummary = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const [
      totalOrders,
      ordersThisMonth,
      ordersLastMonth,
      totalUsers,
      newUsersThisMonth,
      totalMedicines,
      pendingPrescriptions,
      revenueThisMonth,
      revenueLastMonth,
      ordersByStatus,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
      Medicine.countDocuments(),
      Prescription.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, paymentStatus: 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Order.find()
        .sort('-createdAt')
        .limit(5)
        .populate('user', 'name email')
        .select('totalAmount status createdAt user'),
    ]);

    const thisMonthRevenue = revenueThisMonth[0]?.total ?? 0;
    const lastMonthRevenue = revenueLastMonth[0]?.total ?? 0;
    const revenueGrowth = lastMonthRevenue === 0
      ? null
      : Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);

    const orderGrowth = ordersLastMonth === 0
      ? null
      : Math.round(((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100);

    res.status(200).json({
      success: true,
      data: {
        orders: {
          total: totalOrders,
          thisMonth: ordersThisMonth,
          growthPercent: orderGrowth,
          byStatus: Object.fromEntries(ordersByStatus.map(({ _id, count }) => [_id, count])),
        },
        revenue: {
          thisMonth: thisMonthRevenue,
          lastMonth: lastMonthRevenue,
          growthPercent: revenueGrowth,
        },
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
        },
        medicines: {
          total: totalMedicines,
        },
        prescriptions: {
          pending: pendingPrescriptions,
        },
        recentOrders,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getRevenueChart = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

    const data = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate }, paymentStatus: 'Paid' } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

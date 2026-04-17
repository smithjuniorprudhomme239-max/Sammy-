const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getDashboardStats = async (req, res) => {
  const [totalUsers, totalProducts, orders] = await Promise.all([
    User.countDocuments({ role: 'customer' }),
    Product.countDocuments({ isActive: true }),
    Order.find({ isPaid: true }),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const recentOrders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 }).limit(10);

  const salesByMonth = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: { $month: '$createdAt' }, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
    { $sort: { '_id': 1 } },
  ]);

  res.json({ totalUsers, totalProducts, totalOrders: orders.length, revenue: revenue.toFixed(2), recentOrders, salesByMonth });
};

exports.getAllOrders = async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = status ? { status } : {};
  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'name email').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(+limit),
    Order.countDocuments(filter),
  ]);
  res.json({ orders, total, pages: Math.ceil(total / limit) });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
};

exports.updateUserRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

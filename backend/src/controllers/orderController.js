const Order = require('../models/Order');
const Product = require('../models/Product');
const { sendEmail, emailTemplates } = require('../utils/email');

exports.createOrder = async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  const productIds = items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });

  let itemsPrice = 0;
  const orderItems = items.map((item) => {
    const product = products.find((p) => p._id.toString() === item.product);
    if (!product) throw { status: 404, message: `Product ${item.product} not found` };
    if (product.stock < item.qty) throw { status: 400, message: `Insufficient stock for ${product.name}` };
    itemsPrice += product.price * item.qty;
    return { product: product._id, name: product.name, image: product.images[0], price: product.price, qty: item.qty };
  });

  const shippingPrice = itemsPrice > 100 ? 0 : 9.99;
  const taxPrice = +(itemsPrice * 0.08).toFixed(2);
  const totalPrice = +(itemsPrice + shippingPrice + taxPrice).toFixed(2);

  const order = await Order.create({
    user: req.user._id, items: orderItems, shippingAddress,
    paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice,
  });

  await Promise.all(
    orderItems.map((item) => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } }))
  );

  res.status(201).json(order);
};

exports.getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

exports.getOrder = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  res.json(order);
};

exports.updateOrderStatus = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
};

exports.markPaid = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'email name');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body;
  order.status = 'processing';
  await order.save();

  await sendEmail({ to: order.user.email, subject: `Order Confirmed #${order._id}`, html: emailTemplates.orderConfirmation(order) });
  res.json(order);
};

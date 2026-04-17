const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

exports.createPaymentIntent = async (req, res) => {
  const order = await Order.findById(req.body.orderId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(order.totalPrice * 100),
    currency: 'usd',
    metadata: { orderId: order._id.toString() },
  });

  res.json({ clientSecret: paymentIntent.client_secret });
};

exports.webhook = async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, req.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return res.status(400).json({ message: 'Webhook signature verification failed' });
  }

  if (event.type === 'payment_intent.succeeded') {
    const { orderId } = event.data.object.metadata;
    await Order.findByIdAndUpdate(orderId, { isPaid: true, paidAt: new Date(), status: 'processing', paymentResult: { id: event.data.object.id, status: 'succeeded' } });
  }

  res.json({ received: true });
};

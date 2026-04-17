const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name avatar')
    .sort({ createdAt: -1 });
  res.json(reviews);
};

exports.createReview = async (req, res) => {
  const { productId } = req.params;
  const existing = await Review.findOne({ user: req.user._id, product: productId });
  if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

  const purchase = await Order.findOne({ user: req.user._id, 'items.product': productId, isPaid: true });
  const review = await Review.create({
    user: req.user._id, product: productId,
    rating: req.body.rating, title: req.body.title, comment: req.body.comment,
    isVerifiedPurchase: !!purchase,
  });

  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    { $group: { _id: null, avg: { $avg: '$rating' }, count: { $sum: 1 } } },
  ]);
  await Product.findByIdAndUpdate(productId, { rating: stats[0].avg.toFixed(1), numReviews: stats[0].count });

  res.status(201).json(review);
};

exports.deleteReview = async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: 'Review not found' });
  if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
    return res.status(403).json({ message: 'Not authorized' });
  await review.deleteOne();
  res.json({ message: 'Review removed' });
};

const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  const { page = 1, limit = 12, category, brand, minPrice, maxPrice, search, sort, featured } = req.query;
  const filter = { isActive: true };

  if (category) filter.category = category;
  if (brand) filter.brand = brand;
  if (featured) filter.isFeatured = true;
  if (minPrice || maxPrice) filter.price = { ...(minPrice && { $gte: +minPrice }), ...(maxPrice && { $lte: +maxPrice }) };
  if (search) filter.$text = { $search: search };

  const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, newest: { createdAt: -1 }, rating: { rating: -1 } };
  const sortBy = sortMap[sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortBy).skip((page - 1) * limit).limit(+limit),
    Product.countDocuments(filter),
  ]);

  res.json({ products, total, pages: Math.ceil(total / limit), page: +page });
};

exports.getProduct = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, isActive: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

exports.updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Product removed' });
};

exports.getFeatured = async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
  res.json(products);
};

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');
const Product = require('./src/models/Product');

const PRODUCTS = [
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise canceling headphones with 30-hour battery and multipoint connection.',
    price: 349.99, comparePrice: 399.99,
    category: 'Audio', brand: 'Sony',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
    stock: 80, sku: 'SNY-WH1000XM5',
    specs: new Map([['Battery', '30 hours'], ['Driver', '30mm'], ['Connectivity', 'Bluetooth 5.2'], ['Weight', '250g']]),
    isFeatured: true, rating: 4.8, numReviews: 456,
  },
  {
    name: 'iPad Pro 12.9" M2',
    slug: 'ipad-pro-12-m2',
    description: 'The ultimate iPad experience with M2 chip, Liquid Retina XDR display, and Apple Pencil support.',
    price: 1099.99,
    category: 'Tablets', brand: 'Apple',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600'],
    stock: 25, sku: 'APL-IPADPRO12-M2',
    specs: new Map([['Chip', 'Apple M2'], ['Storage', '256GB'], ['Display', '12.9" Liquid Retina XDR'], ['Connectivity', 'Wi-Fi 6E']]),
    isFeatured: false, rating: 4.7, numReviews: 92,
  },
];


async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await Promise.all([User.deleteMany({}), Product.deleteMany({})]);
  console.log('Cleared existing data');

  await User.create({
    name: 'Admin User',
    email: 'admin@unidev.com',
    password: 'admin123',
    role: 'admin',
    isVerified: true,
  });
  console.log('Admin created: admin@unidev.com / admin123');

  await Product.insertMany(PRODUCTS);
  console.log(`${PRODUCTS.length} products seeded`);

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch((err) => { console.error(err); process.exit(1); });
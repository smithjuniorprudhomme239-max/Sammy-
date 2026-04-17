const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/techgadget_test');
});

afterAll(async () => {
  await User.deleteMany({ email: /test/ });
  await mongoose.connection.close();
});

describe('Auth API', () => {
  const testUser = { name: 'Test User', email: 'test@example.com', password: 'password123' };

  it('POST /api/auth/register - should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.message).toContain('verify');
  });

  it('POST /api/auth/register - should reject duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(400);
  });

  it('POST /api/auth/login - should reject unverified user', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(403);
  });

  it('POST /api/auth/login - should reject invalid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: testUser.email, password: 'wrongpass' });
    expect(res.status).toBe(401);
  });
});

describe('Products API', () => {
  it('GET /api/products - should return paginated products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(res.body).toHaveProperty('total');
  });

  it('GET /api/products - should filter by category', async () => {
    const res = await request(app).get('/api/products?category=Phones');
    expect(res.status).toBe(200);
  });
});

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-intent', protect, ctrl.createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), ctrl.webhook);

module.exports = router;

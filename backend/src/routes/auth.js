const router = require('express').Router();
const { body } = require('express-validator');
const ctrl = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/register', [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], validate, ctrl.register);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, ctrl.login);
router.get('/verify-email', ctrl.verifyEmail);
router.post('/forgot-password', [body('email').isEmail()], validate, ctrl.forgotPassword);
router.post('/reset-password', [body('password').isLength({ min: 6 })], validate, ctrl.resetPassword);
router.get('/me', protect, ctrl.getMe);

module.exports = router;

const router = require('express').Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

router.use(protect);

router.put('/profile', async (req, res) => {
  const { name, address } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, address }, { new: true });
  res.json(user);
});

router.put('/password', async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!(await user.comparePassword(req.body.currentPassword)))
    return res.status(400).json({ message: 'Current password is incorrect' });
  user.password = req.body.newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
});

module.exports = router;

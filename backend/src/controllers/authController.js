const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/email');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already in use' });

  const user = await User.create({ name, email, password, isVerified: true });
  res.status(201).json({ message: 'Registration successful. You can now log in.' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' });

  res.json({ token: signToken(user._id), user });
};

exports.verifyEmail = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { verificationToken: req.query.token },
    { isVerified: true, verificationToken: undefined },
    { new: true }
  );
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  res.json({ message: 'Email verified successfully' });
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ message: 'No account with that email' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();

  await sendEmail({ to: user.email, subject: 'Password Reset', html: emailTemplates.passwordReset(token) });
  res.json({ message: 'Password reset email sent' });
};

exports.resetPassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ message: 'Password reset successful' });
};

exports.getMe = async (req, res) => res.json(req.user);

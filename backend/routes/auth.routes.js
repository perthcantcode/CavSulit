const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { User } = require('../models');
const { protect, requireCvsu } = require('../middleware/auth');

const sign = u => jwt.sign({ id: u.id, email: u.email, role: u.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
const safe = u => ({ id: u.id, fullName: u.fullName, email: u.email, studentId: u.studentId, department: u.department, contactNumber: u.contactNumber, profilePhoto: u.profilePhoto, badgeLevel: u.badgeLevel, isVerified: u.isVerified, role: u.role });

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, studentId, department, contactNumber } = req.body;
    if (await User.findOne({ where: { email } }))
      return res.status(400).json({ message: 'Email already registered' });
    const isCvsu = email.endsWith('@cvsu.edu.ph');
    const user = await User.create({
      fullName, email,
      password: await bcrypt.hash(password, 10),
      studentId, department: department || 'OTHER', contactNumber,
      isVerified: false,
      badgeLevel: 'none',
      isCvsuVerified: false,
      role: 'seller',
    });
    res.status(201).json({ token: sign(user),  user: safe(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ token: sign(user), user: safe(user) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(safe(user));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/auth/me
router.put('/me', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    await user.update({ fullName: req.body.fullName, contactNumber: req.body.contactNumber, department: req.body.department });
    res.json(safe(user));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

const admin = require('../config/firebase.config');
const { User } = require('../models');

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;
    const isCvsuEmail = email?.endsWith('@cvsu.edu.ph');
    const isVerified = decoded.email_verified;
    const isCvsu = isCvsuEmail && isVerified;

    let user = await User.findOne({ where: { email } });
    if (!user) {
      user = await User.create({
        id: decoded.uid,
        email,
        fullName: decoded.name || email.split('@')[0],
        badgeLevel: 'none',
        isCvsuVerified: false,
      });
    }

    // Update badge when Firebase confirms email is verified
    if (user && isCvsu && !user.isCvsuVerified) {
      await user.update({ isCvsuVerified: true, badgeLevel: 'cvsu' });
      user.isCvsuVerified = true;
      user.badgeLevel = 'cvsu';
    }

    // Remove badge if email is no longer verified
    if (user && isCvsuEmail && !isVerified && user.isCvsuVerified) {
      await user.update({ isCvsuVerified: false, badgeLevel: 'none' });
      user.isCvsuVerified = false;
      user.badgeLevel = 'none';
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const requireCvsu = (req, res, next) => {
  if (!req.user?.isCvsuVerified) {
    return res.status(403).json({ message: 'CvSU email required to post shops' });
  }
  next();
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return next();
    const decoded = await admin.auth().verifyIdToken(token);
    const email = decoded.email;
    let user = await User.findOne({ where: { email } });
    req.user = user;
    next();
  } catch (err) {
    next();
  }
};

module.exports = { protect, requireCvsu, optionalAuth };
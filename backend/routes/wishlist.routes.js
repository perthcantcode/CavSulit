const router = require('express').Router();
const { Wishlist, Shop, User, Product, Review } = require('../models');
const { protect } = require('../middleware/auth');

// Helper: coerce shopId to a safe integer primitive
function sanitizeShopId(raw) {
  const id = parseInt(String(raw), 10);
  if (isNaN(id) || id <= 0) return null;
  return id;
}

// GET /api/wishlist
router.get('/', protect, async (req, res) => {
  try {
    const items = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Shop, as: 'shop',
        include: [
          { model: User,    as: 'seller',   attributes: ['id','fullName','badgeLevel','department'] },
          { model: Product, as: 'products', attributes: ['id','name','price'] },
          { model: Review,  as: 'reviews',  attributes: ['stars'] },
        ],
      }],
      order: [['createdAt','DESC']],
    });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/wishlist/:shopId  — toggle
router.post('/:shopId', protect, async (req, res) => {
  try {
    const shopId = sanitizeShopId(req.params.shopId);
    if (!shopId) return res.status(400).json({ message: 'Invalid shop ID.' });

    const existing = await Wishlist.findOne({ where: { userId: req.user.id, shopId } });
    if (existing) {
      await existing.destroy();
      return res.json({ saved: false });
    }
    await Wishlist.create({ userId: req.user.id, shopId });
    res.json({ saved: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/wishlist/check/:shopId
router.get('/check/:shopId', protect, async (req, res) => {
  try {
    const shopId = sanitizeShopId(req.params.shopId);
    if (!shopId) return res.status(400).json({ message: 'Invalid shop ID.' });

    const item = await Wishlist.findOne({ where: { userId: req.user.id, shopId } });
    res.json({ saved: !!item });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
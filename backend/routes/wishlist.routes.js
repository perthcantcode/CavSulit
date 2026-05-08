const router = require('express').Router();
const { Wishlist, Shop, User, Product, Review } = require('../models');
const { protect } = require('../middleware/auth');

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
    const existing = await Wishlist.findOne({ where: { userId: String(req.user.id), shopId: String(req.params.shopId) } });
    if (existing) {
      await existing.destroy();
      return res.json({ saved: false });
    }
    await Wishlist.create({ userId: req.user.id, shopId: req.params.shopId });
    res.json({ saved: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/wishlist/check/:shopId
router.get('/check/:shopId', protect, async (req, res) => {
  try {
    const item = await Wishlist.findOne({ where: { userId: req.user.id, shopId: req.params.shopId } });
    res.json({ saved: !!item });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

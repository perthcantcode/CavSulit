const router  = require('express').Router();
const { Op }  = require('sequelize');
const { Shop, Product, User, Review, Analytics, ShopView } = require('../models');
const { protect, optionalAuth, requireCvsu } = require('../middleware/auth');
const upload  = require('../middleware/upload');

const VIEW_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

// FIX: persistent unique-view check using the ShopView DB table instead of
// in-memory Map. Works correctly even when Render spins down and restarts.
async function isUniqueView(req, shopId) {
  const viewerKey = req.user?.id || req.ip || 'unknown';
  const cutoff    = new Date(Date.now() - VIEW_WINDOW_MS);

  const existing = await ShopView.findOne({
    where: { shopId, viewerKey, lastViewedAt: { [Op.gte]: cutoff } },
  });

  if (existing) return false; // viewed within 24h — don't count

  // Upsert: update timestamp if row exists (older than 24h), else create new row
  await ShopView.upsert({ shopId, viewerKey, lastViewedAt: new Date() });
  return true;
}

// GET /api/shops
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, college, search, sort = 'recent', page = 1, limit = 8 } = req.query;
    const where = { isActive: true };
    if (category && category !== 'all') where.category = category;
    if (college  && college  !== 'all') where.college  = college;
    if (search) where.name = { [Op.like]: `%${search}%` };
    const order  = sort === 'popular' ? [['views','DESC']] : [['createdAt','DESC']];
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Shop.findAndCountAll({
      where, order, limit: parseInt(limit), offset,
      include: [
        { model: User,    as: 'seller',   attributes: ['id','fullName','badgeLevel','department','profilePhoto'] },
        { model: Product, as: 'products', attributes: ['id','name','price','isAvailable'] },
        { model: Review,  as: 'reviews',  attributes: ['stars'] },
      ],
    });
    const shops = rows.map(s => {
      const avg = s.reviews?.length ? (s.reviews.reduce((a,r)=>a+r.stars,0)/s.reviews.length).toFixed(1) : null;
      return { ...s.toJSON(), avgRating: avg, reviewCount: s.reviews?.length || 0 };
    });
    res.json({ total: count, page: parseInt(page), totalPages: Math.ceil(count/parseInt(limit)), shops });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/shops/mine
router.get('/mine', protect, async (req, res) => {
  try {
    const shops = await Shop.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, as: 'products' }, { model: Review, as: 'reviews', attributes: ['stars'] }],
      order: [['createdAt','DESC']],
    });
    res.json(shops);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/shops/:id
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id, {
      include: [
        { model: User,    as: 'seller',   attributes: ['id','fullName','badgeLevel','department','profilePhoto','contactNumber'] },
        { model: Product, as: 'products' },
        { model: Review,  as: 'reviews',  include: [{ model: User, as: 'reviewer', attributes: ['id','fullName','profilePhoto','department'] }] },
      ],
    });
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    // FIX: DB-backed unique view — survives server restarts
    const unique = await isUniqueView(req, req.params.id);
    if (unique) {
      await shop.increment('views');
      await Analytics.create({ shopId: req.params.id, type: 'view', date: new Date() });
    }

    const avg = shop.reviews?.length ? (shop.reviews.reduce((a,r)=>a+r.stars,0)/shop.reviews.length).toFixed(1) : null;
    res.json({ ...shop.toJSON(), avgRating: avg, reviewCount: shop.reviews?.length || 0 });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/shops
router.post('/', protect, requireCvsu, upload.array('photos', 5), async (req, res) => {
  try {
    const { name, description, category, college, locationDesc, lat, lng, availableDate } = req.body;
    const photos = req.files ? req.files.map(f => f.path) : [];
    const shop   = await Shop.create({
      userId: req.user.id, name, description,
      category: category || 'other', college: college || 'Other',
      locationDesc, lat: lat || null, lng: lng || null,
      photos, availableDate: availableDate || null,
    });
    res.status(201).json(shop);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/shops/:id
router.put('/:id', protect, upload.array('photos', 5), async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Not found' });
    if (shop.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    const updates = { ...req.body };
    if (req.files?.length) updates.photos = req.files.map(f => f.path);
    await shop.update(updates);
    res.json(shop);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/shops/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Not found' });
    if (shop.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    await shop.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
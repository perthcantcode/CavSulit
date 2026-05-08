const router = require('express').Router();
const { Analytics, Shop } = require('../models');
const { protect } = require('../middleware/auth');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// POST /api/analytics/track
router.post('/track', async (req, res) => {
  try {
    const { shopId, type } = req.body;
    await Analytics.create({ shopId, type, date: new Date() });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/analytics/:shopId
router.get('/:shopId', protect, async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.shopId);
    if (!shop || shop.userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalViews, totalClicks, totalMessages, weekly] = await Promise.all([
      Analytics.count({ where: { shopId: String(req.params.shopId), type: 'view' } }),
      Analytics.count({ where: { shopId: String(req.params.shopId), type: 'click' } }),
      Analytics.count({ where: { shopId: String(req.params.shopId), type: 'message' } }),
      Analytics.findAll({
        where: { shopId: String(req.params.shopId), type: 'view', date: { [Op.gte]: sevenDaysAgo } },
        attributes: ['date', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['date'],
        order: [['date','ASC']],
        raw: true,
      }),
    ]);

    res.json({ totalViews, totalClicks, totalMessages, weekly });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;

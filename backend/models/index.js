const { sequelize } = require('../config/db.config');
const { DataTypes } = require('sequelize');

const User = sequelize.define('User', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  fullName:      { type: DataTypes.STRING(100), allowNull: false },
  email:         { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password:      { type: DataTypes.STRING, allowNull: false },
  studentId:     { type: DataTypes.STRING(20), allowNull: true },
  department:    { type: DataTypes.ENUM('CEIT','CON','CEMDS','COE','CAS','CSPEAR','SHIBAL,'OTHER'), defaultValue: 'OTHER' },
  contactNumber: { type: DataTypes.STRING(15), allowNull: true },
  profilePhoto:  { type: DataTypes.STRING, allowNull: true },
  badgeLevel:    { type: DataTypes.ENUM('none','cvsu','trusted','top_seller'), defaultValue: 'none' },
  isVerified:    { type: DataTypes.BOOLEAN, defaultValue: false },
  role:          { type: DataTypes.ENUM('user','seller','admin'), defaultValue: 'seller' },
}, { tableName: 'users', timestamps: true });

const Shop = sequelize.define('Shop', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId:        { type: DataTypes.UUID, allowNull: false },
  name:          { type: DataTypes.STRING(100), allowNull: false },
  description:   { type: DataTypes.TEXT, allowNull: true },
  category:      { type: DataTypes.ENUM('food','drinks','merch','accessories','school_supplies','beauty','services','other'), defaultValue: 'other' },
  college:       { type: DataTypes.ENUM('CEIT','CON','CEMDS','COE','CAS','Main Gate','Canteen','Dormitory','Other'), defaultValue: 'Other' },
  locationDesc:  { type: DataTypes.STRING(200), allowNull: true },
  lat:           { type: DataTypes.DECIMAL(10,7), allowNull: true },
  lng:           { type: DataTypes.DECIMAL(10,7), allowNull: true },
  photos:        { type: DataTypes.JSON, defaultValue: [] },
  availableDate: { type: DataTypes.DATEONLY, allowNull: true },
  isActive:      { type: DataTypes.BOOLEAN, defaultValue: true },
  views:         { type: DataTypes.INTEGER, defaultValue: 0 },
  clicks:        { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'shops', timestamps: true });

const Product = sequelize.define('Product', {
  id:          { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  shopId:      { type: DataTypes.UUID, allowNull: false },
  name:        { type: DataTypes.STRING(100), allowNull: false },
  price:       { type: DataTypes.DECIMAL(10,2), allowNull: false },
  image:       { type: DataTypes.STRING, allowNull: true },
  isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'products', timestamps: true });

const Message = sequelize.define('Message', {
  id:         { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  senderId:   { type: DataTypes.UUID, allowNull: false },
  receiverId: { type: DataTypes.UUID, allowNull: false },
  shopId:     { type: DataTypes.UUID, allowNull: true },
  text:       { type: DataTypes.TEXT, allowNull: false },
  isRead:     { type: DataTypes.BOOLEAN, defaultValue: false },
}, { tableName: 'messages', timestamps: true });

const Review = sequelize.define('Review', {
  id:      { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  shopId:  { type: DataTypes.UUID, allowNull: false },
  userId:  { type: DataTypes.UUID, allowNull: false },
  stars:   { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  comment: { type: DataTypes.TEXT, allowNull: true },
}, { tableName: 'reviews', timestamps: true });

const PreOrder = sequelize.define('PreOrder', {
  id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  shopId:       { type: DataTypes.UUID, allowNull: false },
  buyerId:      { type: DataTypes.UUID, allowNull: false },
  items:        { type: DataTypes.JSON, defaultValue: [] },
  pickupTime:   { type: DataTypes.STRING, allowNull: true },
  locationNote: { type: DataTypes.STRING(200), allowNull: true },
  status:       { type: DataTypes.ENUM('pending','confirmed','done','cancelled'), defaultValue: 'pending' },
}, { tableName: 'preorders', timestamps: true });

const Wishlist = sequelize.define('Wishlist', {
  id:     { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  shopId: { type: DataTypes.UUID, allowNull: false },
}, { tableName: 'wishlists', timestamps: true });

const Analytics = sequelize.define('Analytics', {
  id:     { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  shopId: { type: DataTypes.UUID, allowNull: false },
  type:   { type: DataTypes.ENUM('view','click','message'), allowNull: false },
  date:   { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
}, { tableName: 'analytics', timestamps: true });

// Associations
Shop.belongsTo(User,     { foreignKey: 'userId',    as: 'seller' });
User.hasMany(Shop,       { foreignKey: 'userId',    as: 'shops' });
Product.belongsTo(Shop,  { foreignKey: 'shopId',    as: 'shop' });
Shop.hasMany(Product,    { foreignKey: 'shopId',    as: 'products' });
Review.belongsTo(Shop,   { foreignKey: 'shopId',    as: 'shop' });
Review.belongsTo(User,   { foreignKey: 'userId',    as: 'reviewer' });
Shop.hasMany(Review,     { foreignKey: 'shopId',    as: 'reviews' });
PreOrder.belongsTo(Shop, { foreignKey: 'shopId',    as: 'shop' });
PreOrder.belongsTo(User, { foreignKey: 'buyerId',   as: 'buyer' });
Wishlist.belongsTo(User, { foreignKey: 'userId',    as: 'user' });
Wishlist.belongsTo(Shop, { foreignKey: 'shopId',    as: 'shop' });
Message.belongsTo(User,  { foreignKey: 'senderId',  as: 'sender' });
Message.belongsTo(User,  { foreignKey: 'receiverId',as: 'receiver' });
Analytics.belongsTo(Shop,{ foreignKey: 'shopId',    as: 'shop' });

module.exports = { sequelize, User, Shop, Product, Message, Review, PreOrder, Wishlist, Analytics };

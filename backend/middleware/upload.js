const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

const dir = path.join(__dirname, '../uploads');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, dir),
  filename:    (req, file, cb) =>
    cb(null, `${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname)}`),
});

const fileFilter = (req, file, cb) =>
  cb(null, /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase()));

module.exports = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

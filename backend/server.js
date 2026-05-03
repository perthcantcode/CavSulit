require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const http     = require('http');
const { Server } = require('socket.io');
const path     = require('path');
const { sequelize } = require('./models');

const app    = express();
const server = http.createServer(app);

// Socket.io for real-time messaging
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET','POST'] }
});

io.on('connection', socket => {
  socket.on('join', userId => socket.join(userId));
  socket.on('send_message', ({ to, message }) => io.to(to).emit('receive_message', message));
  socket.on('disconnect', () => {});
});

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth',      require('./routes/auth.routes'));
app.use('/api/shops',     require('./routes/shop.routes'));
app.use('/api/products',  require('./routes/product.routes'));
app.use('/api/reviews',   require('./routes/review.routes'));
app.use('/api/messages',  require('./routes/message.routes'));
app.use('/api/wishlist',  require('./routes/wishlist.routes'));
app.use('/api/preorders', require('./routes/preorder.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));

app.get('/', (req, res) => res.json({ message: '🟢 CavSulit API running' }));

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    server.listen(PORT, () => console.log(`✅ Server on http://localhost:${PORT}`));
    console.log('✅ Database synced');
  })
  .catch(err => console.error('❌ Startup error:', err));

const uploadRoutes = require('./routes/uploadRoutes');
const authRoutes = require('./routes/authRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const matchRoutes = require('./routes/matchRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');
const testRoutes = require('./routes/testRoutes');

module.exports = (app) => {

  app.use('/api/auth', authRoutes);
  app.use('/api/registration', registrationRoutes);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/match', matchRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/test', testRoutes);
};

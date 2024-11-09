const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitnessTracker';

// Updated connection code without deprecated options
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Ensure you're using the newer connection model
})
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

module.exports = mongoose.connection;


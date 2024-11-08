const mongoose = require('mongoose');

// Use the MONGODB_URI from environment variables or fallback to the local MongoDB URI
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/fitnesstracker';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Export the connection to be used in other parts of the application
module.exports = mongoose.connection;

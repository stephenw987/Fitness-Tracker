const mongoose = require('mongoose'); // Import mongoose for schema definition

// Define a schema for User
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }, 
});

// Export the User model based on the schema
module.exports = mongoose.model('User', userSchema);

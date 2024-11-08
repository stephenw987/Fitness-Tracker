const mongoose = require('mongoose'); // Import mongoose for schema definition

// Define a schema for Exercise
const exerciseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  date: { type: Date, default: Date.now }, // Date defaults to the current date if not provided
  type: { type: String, required: true }, // Type of exercise is required
  duration: { type: Number, required: true }, // Duration of exercise in minutes is required
});


module.exports = mongoose.model('Exercise', exerciseSchema);

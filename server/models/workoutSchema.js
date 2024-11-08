const { Schema } = require('mongoose');

// Subdocument schema for individual exercises in a workout
const exerciseSchema = new Schema({
  name: {
    type: String,
    required: true, // Exercise name (e.g., "Squat", "Push-up")
  },
  sets: {
    type: Number,
    required: true, // Number of sets performed
  },
  reps: {
    type: Number,
    required: true, // Number of repetitions per set
  },
  weight: {
    type: Number, // Weight used (e.g., in kg or lbs)
  },
  duration: {
    type: Number, // Duration of the exercise (in seconds or minutes)
  },
  caloriesBurned: {
    type: Number, // Calories burned during this exercise
  },
  comments: {
    type: String, // Additional notes for the exercise
  },
});

// Main workout schema
const workoutSchema = new Schema({
  date: {
    type: Date,
    default: Date.now, // Date of the workout
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who performed the workout
    required: true,
  },
  exercises: [exerciseSchema], // Array of exercises in the workout
  totalCaloriesBurned: {
    type: Number, // Total calories burned in this workout
    default: 0,
  },
  totalDuration: {
    type: Number, // Total duration of the workout (in minutes or seconds)
    default: 0,
  },
});

module.exports = workoutSchema; // Make sure to export the schema correctly

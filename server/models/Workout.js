const { Schema, model } = require('mongoose');

// Workout schema for individual workouts
const workoutSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      required: true,
    },
    caloriesBurned: {
      type: Number, // Optional: Track calories burned
    },
    type: {
      type: String, // E.g., "Cardio", "Strength", "Yoga", etc.
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    image: {
      type: String, // Optional image for the workout
    },
  },
  { timestamps: true }
);

const Workout = model('Workout', workoutSchema);

module.exports = Workout;

const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const workoutSchema = require('./Workout');  // Import workout schema for use as reference

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    // Use references to workouts (ObjectId)
    savedWorkouts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Workout', // Reference to Workout model
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user password before saving to database
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Custom method to compare and validate password for logging in
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// Virtual to get the count of saved workouts
userSchema.virtual('workoutCount').get(function () {
  return this.savedWorkouts.length;
});

const User = model('User', userSchema);

module.exports = User;

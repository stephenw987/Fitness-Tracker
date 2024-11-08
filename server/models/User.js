const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,  // Ensuring that username is unique
    },
    email: {
      type: String,
      required: true,
      unique: true,  // Ensuring that email is unique
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    savedWorkouts: {
      type: [Object],  // Adjust depending on your workout data model
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Hash the password before saving it to the database
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to check if the entered password matches the hashed password
userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

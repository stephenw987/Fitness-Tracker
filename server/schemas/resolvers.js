const { User, Workout } = require('../models'); // Import both User and Workout models
const { AuthenticationError } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    saveWorkout: async (parent, { workoutData }, context) => {
      if (context.user) {
        // Create and save new workout
        const newWorkout = new Workout({
          name: workoutData.name,
          description: workoutData.description,
          duration: workoutData.duration,
          caloriesBurned: workoutData.caloriesBurned,
          type: workoutData.type,
          date: workoutData.date,
         // image: workoutData.image,
        });

        await newWorkout.save();

        // Add the new workout to the user's savedWorkouts (only save the workoutId)
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $push: { savedWorkouts: newWorkout._id } }, // Push workout's ObjectId
          { new: true }
        );

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },

    removeWorkout: async (parent, { workoutId }, context) => {
      if (context.user) {
        // Remove the workout from savedWorkouts by workoutId
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedWorkouts: workoutId } }, // Pull workoutId from savedWorkouts
          { new: true }
        );

        // Optionally, remove the workout document from the Workout collection itself
        await Workout.findByIdAndDelete(workoutId);

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;

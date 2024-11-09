const { User, Workout } = require('../models'); // Import both User and Workout models
const { signToken, AuthenticationError } = require('../utils/auth');


const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password').populate("savedWorkouts");
        console.log(userData);
        return userData;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw AuthenticationError
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw AuthenticationError
      }

      const token = signToken(user);

      return { token, user };
    },
    
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
        ).populate("savedWorkouts");
        console.log (updatedUser);

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
        ).populate("savedWorkouts");
        console.log(updatedUser);

        // Optionally, remove the workout document from the Workout collection itself
        await Workout.findByIdAndDelete(workoutId);

        return updatedUser;
      }

      throw new AuthenticationError('You need to be logged in!');
    },
  },
};

module.exports = resolvers;

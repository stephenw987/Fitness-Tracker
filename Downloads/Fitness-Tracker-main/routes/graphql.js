const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLSchema } = require('graphql');
const User = require('../models/User'); 
const Exercise = require('../models/Exercise'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');


dotenv.config(); // Load environment variables

// Define a GraphQL object type for User
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString }, // User ID
    username: { type: GraphQLString }, // Username
    exercises: { // Exercises associated with the user
      type: new GraphQLList(ExerciseType),
      resolve(parent) { // Resolver function to fetch exercises
        return Exercise.find({ userId: parent.id }); // Find exercises by user ID
      },
    },
  }),
});


const ExerciseType = new GraphQLObjectType({
  name: 'Exercise',
  fields: () => ({
    id: { type: GraphQLString }, // Exercise ID
    userId: { type: GraphQLString }, // Associated user ID
    date: { type: GraphQLString }, // Date of the exercise
    type: { type: GraphQLString }, // Type of exercise (e.g., running, cycling)
    duration: { type: GraphQLInt }, // Duration of exercise in minutes
  }),
});


const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: { // Register a new user
      type: UserType,
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, { username, password }) {
        const hashedPassword = await bcrypt.hash(password, 10); 
        const user = new User({ username, password: hashedPassword }); 
        await user.save(); 
        return user; 
      },
    },
    login: { 
      type: GraphQLString, 
      args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
      },
      async resolve(_, { username, password }) {
        const user = await User.findOne({ username }); // Find user by username
        if (user && await bcrypt.compare(password, user.password)) { // Check if the password is correct
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
          return token; 
        }
        throw new Error('Invalid credentials'); // Throw an error if credentials are invalid
      },
    },
    addExercise: { // Add a new exercise entry
      type: ExerciseType,
      args: {
        userId: { type: GraphQLString },
        type: { type: GraphQLString },
        duration: { type: GraphQLInt },
      },
      async resolve(_, { userId, type, duration }) {
        const exercise = new Exercise({ userId, type, duration }); // Create a new Exercise instance
        await exercise.save(); // Save the exercise to the database
        return exercise; // Return the created exercise
      },
    },
    deleteExercise: { // Delete an exercise entry by ID
      type: ExerciseType,
      args: {
        id: { type: GraphQLString },
      },
      async resolve(_, { id }) {
        const exercise = await Exercise.findByIdAndRemove(id); // Find and remove exercise by ID
        return exercise; // Return the removed exercise
      },
    },
  },
});


const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    users: { // Retrieve all users
      type: new GraphQLList(UserType),
      resolve() {
        return User.find(); // Fetch all users from the database
      },
    },
    exercises: { // Retrieve all exercises
      type: new GraphQLList(ExerciseType),
      resolve() {
        return Exercise.find(); // Fetch all exercises from the database
      },
    },
  },
});

// Export the GraphQL schema
module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});

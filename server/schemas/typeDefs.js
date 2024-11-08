const typeDefs = `
  type User {
    _id: ID!
    username: String!
    email: String
    workoutCount: Int
    savedWorkouts: [Workout]
    fitnessGoals: String
    weight: Float
    height: Float
  }

  type Workout {
    _id: ID!
    date: String
    totalCaloriesBurned: Float
    totalDuration: Int
    exercises: [Exercise]
  }

  type Exercise {
    name: String!
    sets: Int!
    reps: Int!
    weight: Float
    duration: Int
    caloriesBurned: Float
    comments: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input ExerciseInput {
    name: String!
    sets: Int!
    reps: Int!
    weight: Float
    duration: Int
    caloriesBurned: Float
    comments: String
  }

  input WorkoutInput {
    date: String
    exercises: [ExerciseInput]
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveWorkout(workoutData: WorkoutInput!): User
    removeWorkout(workoutId: ID!): User
  }
`;

module.exports = typeDefs;

const typeDefs = `
type User {
  _id: ID!
  username: String!
  email: String
  workoutCount: Int
  savedWorkouts: [Workout]
}

type Workout {
  _id: ID!
   name: String!
  caloriesBurned: Int
  description: String!
  duration: Int!
  type: String!
  date: String!
  image: String
}

type Auth {
  token: ID!
  user: User
}

input WorkoutInput {
  name: String!
  caloriesBurned: Int
  description: String!
  duration: Int!
  type: String!
  date: String
  image: String
}

type Query {
  me: User
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  saveWorkout(workoutData: WorkoutInput!): User  # Updated to return Workout
  removeWorkout(workoutId: ID!): User
}
`;

module.exports = typeDefs;

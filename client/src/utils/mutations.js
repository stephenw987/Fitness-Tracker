import { gql } from '@apollo/client';

// Existing login and addUser mutations
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;



// New mutation to save a workout
export const SAVE_WORKOUT = gql`
  mutation saveWorkout($workoutData: WorkoutInput!) {
    saveWorkout(workoutData: $workoutData) {
      _id
      username
      savedWorkouts {
        workoutId
        name
        description
        duration
        caloriesBurned
        type
        date
      }
    }
  }
`;

// You can also add a removeWorkout mutation if you plan to implement removal of saved workouts
export const REMOVE_WORKOUT = gql`
  mutation removeWorkout($workoutId: ID!) {
    removeWorkout(workoutId: $workoutId) {
      _id
      username
      savedWorkouts {
        workoutId
        name
        description
        duration
        caloriesBurned
        type
        date
      }
    }
  }
`;

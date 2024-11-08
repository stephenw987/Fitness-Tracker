// mutation.js
import { gql } from '@apollo/client';

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

export const SAVE_WORKOUT = gql`
  mutation saveWorkout($workoutData: WorkoutInput!) {
    saveWorkout(workoutData: $workoutData) {
      _id
      username
      email
      savedWorkouts {
        _id
        date
        exercises {
          name
          sets
          reps
          weight
          duration
          caloriesBurned
        }
      }
    }
  }
`;

export const REMOVE_WORKOUT = gql`
  mutation removeWorkout($workoutId: ID!) {
    removeWorkout(workoutId: $workoutId) {
      _id
      username
      email
      savedWorkouts {
        _id
        date
        exercises {
          name
          sets
          reps
          weight
        }
      }
    }
  }
`;

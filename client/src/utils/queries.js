// queries.js
import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
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

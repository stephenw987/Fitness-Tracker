// queries.js

import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
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

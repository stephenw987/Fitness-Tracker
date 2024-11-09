// queries.js

import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  query Query {
  me {
    _id
    username
    email
    workoutCount
    savedWorkouts {
      _id
      name
      caloriesBurned
      description
      duration
      type
      date
      image
    }
  }
}
`;

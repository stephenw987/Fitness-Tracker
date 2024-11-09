import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_WORKOUT } from '../utils/mutations';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import Auth from '../utils/auth';

const SavedWorkouts = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeWorkout, { error }] = useMutation(REMOVE_WORKOUT);

  const userData = data?.me || {};

  const handleDeleteWorkout = async (workoutId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeWorkout({ variables: { workoutId } });
      alert('Workout deleted successfully!');
    } catch (err) {
      console.error('Error deleting workout:', err);
      alert('Failed to delete workout');
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return (
    <Container>
      <h2>Saved Workouts</h2>
      <Row>
        {userData.savedWorkouts?.map((workout) => (
          <Col md={4} key={workout.workoutId}>
            <Card>
              <Card.Body>
                <Card.Title>{workout.name}</Card.Title>
                <Card.Text>{workout.description}</Card.Text>
                <Card.Text>Duration: {workout.duration} minutes</Card.Text>
                <Card.Text>Calories Burned: {workout.caloriesBurned}</Card.Text>
                <Card.Text>Type: {workout.type}</Card.Text>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteWorkout(workout.workoutId)}
                >
                  Remove Workout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {error && <p>Error deleting workout: {error.message}</p>}
    </Container>
  );
};

export default SavedWorkouts;


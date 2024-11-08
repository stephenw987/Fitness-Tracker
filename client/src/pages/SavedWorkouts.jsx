import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';
import { REMOVE_WORKOUT } from '../utils/mutations'; // Use a workout mutation instead of REMOVE_BOOK
import { removeWorkoutId } from '../utils/localStorage'; // Update to handle workout IDs

import Auth from '../utils/auth';

const SavedWorkouts = () => {
  const { loading, data } = useQuery(QUERY_ME);
  const [removeWorkout, { error }] = useMutation(REMOVE_WORKOUT); // Change to mutation for removing workouts
  const userData = data?.me || {};

  const handleDeleteWorkout = async (workoutId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    if (!token) {
      return false;
    }

    try {
      const { data } = await removeWorkout({ variables: { workoutId } });
      removeWorkoutId(workoutId); // Handle removing the workout ID from local storage
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <Container>
      <h1>Viewing {userData.username}'s Saved Workouts!</h1>
      <Row>
        {userData.savedWorkouts?.length ? (
          userData.savedWorkouts.map((workout) => (
            <Col md="4" key={workout.workoutId}>
              <Card border="dark">
                {workout.image ? (
                  <Card.Img
                    src={workout.image}
                    alt={`The image for ${workout.title}`}
                    variant="top"
                  />
                ) : null}
                <Card.Body>
                  <Card.Title>{workout.title}</Card.Title>
                  <Card.Text>{workout.description}</Card.Text>
                  <Button className="btn-block btn-danger" onClick={() => handleDeleteWorkout(workout.workoutId)}>
                    Remove this Workout
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <h2>You have no saved workouts!</h2>
        )}
      </Row>
    </Container>
  );
};

export default SavedWorkouts;


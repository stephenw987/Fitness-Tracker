import { useState, useEffect } from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_WORKOUT } from '../utils/mutations'; // Update to use the correct mutation
import { saveWorkoutIds, getSavedWorkoutIds } from '../utils/localStorage';

import Auth from '../utils/auth';

const SearchWorkouts = () => {
  const [searchedWorkouts, setSearchedWorkouts] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedWorkoutIds, setSavedWorkoutIds] = useState(getSavedWorkoutIds());

  const [saveWorkout, { error }] = useMutation(SAVE_WORKOUT);

  useEffect(() => {
    return () => saveWorkoutIds(savedWorkoutIds);
  }, [savedWorkoutIds]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    if (!searchInput) {
      return false;
    }
  
    try {
      // Construct the GraphQL query
      const query = `
        query searchWorkouts($query: String!) {
          searchWorkouts(query: $query) {
            workoutId
            title
            description
            image
          }
        }
      `;
  
      // Send a POST request to your GraphQL endpoint
      const response = await fetch('http://localhost:4000/graphql', {  // Make sure to use the correct GraphQL endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { query: searchInput },  // Pass the search input as a variable
        }),
      });
  
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
  
      const { data } = await response.json();  // Assuming the backend returns data in this format
  
      // Map over the returned data and set it to the state
      const workoutData = data.searchWorkouts.map((workout) => ({
        workoutId: workout.workoutId,
        title: workout.title,
        description: workout.description,
        image: workout.image || '',  // If image is null or undefined, use an empty string
      }));
  
      setSearchedWorkouts(workoutData);
      setSearchInput('');  // Clear the input field after search
  
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleSaveWorkout = async (workoutId) => {
    const workoutToSave = searchedWorkouts.find((workout) => workout.workoutId === workoutId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveWorkout({
        variables: { workoutData: { ...workoutToSave } },
      });
      setSavedWorkoutIds([...savedWorkoutIds, workoutToSave.workoutId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Container>
        <h1>Search for Workouts!</h1>
        <Form onSubmit={handleFormSubmit}>
          <Row>
            <Col xs={12} md={8}>
              <Form.Control
                name="searchInput"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                type="text"
                size="lg"
                placeholder="Search for a workout"
              />
            </Col>
            <Col xs={12} md={4}>
              <Button type="submit" variant="success" size="lg">
                Submit Search
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>

      <Container>
        <h2 className='pt-5'>
          {searchedWorkouts.length
            ? `Viewing ${searchedWorkouts.length} results:`
            : 'Search for a workout to begin'}
        </h2>
        <Row>
          {searchedWorkouts.map((workout) => {
            return (
              <Col md="4" key={workout.workoutId}>
                <Card border="dark" className='mb-3'>
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
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedWorkoutIds?.some(
                          (savedId) => savedId === workout.workoutId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveWorkout(workout.workoutId)}
                      >
                        {savedWorkoutIds?.some((savedId) => savedId === workout.workoutId)
                          ? 'Workout Already Saved!'
                          : 'Save This Workout!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchWorkouts;

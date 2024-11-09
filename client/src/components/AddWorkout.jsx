import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { SAVE_WORKOUT } from '../utils/mutations'; // Assuming this is your mutation file
import moment from 'moment'; // To handle date formatting

const AddWorkout = () => {
  const [workoutData, setWorkoutData] = useState({
    type: '',
    description: '',
    duration: '',
    image: '', // Optional image URL
    date: moment().format('YYYY-MM-DD'), // Default to current date
  });

  const [saveWorkout, { error }] = useMutation(SAVE_WORKOUT);

  // Handle form changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWorkoutData({
      ...workoutData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Validate that duration is a positive number
    if (parseInt(workoutData.duration, 10) <= 0) {
      alert('Please enter a positive duration value.');
      return;
    }

    // Log the workoutData to ensure it's being sent correctly
    console.log('Workout data before mutation:', workoutData);

    try {
      // Log the request payload to see the structure
      const payload = {
        workoutData: {
          type: workoutData.type,
          description: workoutData.description,
          duration: parseInt(workoutData.duration, 10), // Ensure it's an integer
          image: workoutData.image || null, // Handle optional image
          date: workoutData.date, // Ensure date is formatted correctly
        },
      };
      console.log('Sending payload to mutation:', payload);

      // Call mutation to save the workout with all required fields
      const { data } = await saveWorkout({
        variables: payload,
      });

      // Log the response from the mutation
      console.log('Workout saved successfully:', data);

      // Clear the form after successful submission
      setWorkoutData({
        type: '',
        description: '',
        duration: '',
        image: '',
        date: moment().format('YYYY-MM-DD'), // Reset date to today
      });

      alert('Workout saved successfully!');
    } catch (err) {
      // Log the error to see what went wrong
      console.error('Error saving workout:', err);
      alert('Error saving workout: ' + err.message);
    }
  };

  return (
    <Container className="add-workout-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="add-workout-card">
            <h2>Add a New Workout</h2>
            <Form onSubmit={handleFormSubmit}>
              <Form.Group>
                <Form.Label>Workout Type</Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  value={workoutData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choose...</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Strength">Strength</option>
                  <option value="Yoga">Yoga</option>
                  <option value="HIIT">HIIT</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Enter workout description. Example calories burned"
                  name="description"
                  value={workoutData.description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Duration (minutes)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Duration"
                  name="duration"
                  value={workoutData.duration}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={workoutData.date}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Image (Optional)</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Image URL"
                  name="image"
                  value={workoutData.image}
                  onChange={handleInputChange}
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="mt-3">
                Save Workout
              </Button>
            </Form>

            {error && <p className="error-message">Error saving workout: {error.message}</p>}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AddWorkout;

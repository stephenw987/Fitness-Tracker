import { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import Auth from '../utils/auth';

const SignupForm = () => {
  // Initial form state
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  // Form validation state
  const [validated] = useState(false);

  // Alert state for errors
  const [showAlert, setShowAlert] = useState(false);

  // Mutation hook for creating user
  const [addUser, { error }] = useMutation(ADD_USER);

  // Effect to handle error visibility
  useEffect(() => {
    if (error) {
      console.error("Signup mutation error:", error);  // Log the detailed error for debugging
      setShowAlert(true);
    } else {
      setShowAlert(false);
    }
  }, [error]);

  // Handle input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check if form is valid
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    // Logging form data to ensure proper submission
    console.log("Form data being submitted:", userFormData);

    try {
      const { data } = await addUser({
        variables: { ...userFormData },  // Passing the form data as variables
      });
      console.log('User created successfully:', data);  // Log the returned data for debugging

      Auth.login(data.addUser.token);  // Call Auth to log in the user

    } catch (err) {
      // Log any errors that occur during the mutation
      console.error("Error during signup mutation:", err);
    }

    // Reset form fields after submission
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  return (
    <>
      {/* Form validation */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Show alert if there's an error */}
        <Alert
          dismissible
          onClose={() => setShowAlert(false)}
          show={showAlert}
          variant="danger"
        >
          Something went wrong with your signup! Please try again.
        </Alert>

        {/* Form Title */}
        <h2 className="text-center mb-4">Create Your Fitness Tracker Account</h2>

        {/* Username input */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor="username">Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Choose a username"
            name="username"
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type="invalid">
            Username is required!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Email input */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Your email address"
            name="email"
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Password input */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Create a password"
            name="password"
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>

        {/* Submit Button */}
        <Button
          disabled={
            !(
              userFormData.username &&
              userFormData.email &&
              userFormData.password
            )
          }
          type="submit"
          variant="success"
          block={true} // Explicitly setting the block prop to true
        >
          Sign Up
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;

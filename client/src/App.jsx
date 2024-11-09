import './App.css';
import { Routes, Route } from 'react-router-dom';  // Use Routes and Route to define routing
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import Navbar from './components/Navbar';
import AddWorkoutPage from './pages/AddWorkoutPage'; // Import the new AddWorkoutPage
import SavedWorkouts from './pages/SavedWorkouts';    // You already have this page

// Construct our main GraphQL API endpoint
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to the Fitness Tracker</h1>
          <p className="hero-subtitle">Track your workouts and achieve your fitness goals</p>
          <a href="/add-workout" className="cta-button">Get Started</a>
        </div>
      </div>

      {/* Define the routes for different pages */}
      <Routes>
        <Route path="/" element={<h1>Welcome to the Fitness Tracker</h1>} />
        <Route path="/add-workout" element={<AddWorkoutPage />} />
        <Route path="/saved-workouts" element={<SavedWorkouts />} />
      </Routes>
    </ApolloProvider>
  );
}

export default App;

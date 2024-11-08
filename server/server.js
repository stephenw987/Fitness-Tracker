require('dotenv').config();

const express = require('express');
const path = require('path');
// Import the ApolloServer class from @apollo/server
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth'); // Make sure your authMiddleware is set up correctly


const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection'); // Ensure you're connecting to the right MongoDB instance

const PORT = process.env.PORT || 5000;// Port configuration
const server = new ApolloServer({
  typeDefs,      // The updated typeDefs that include workouts
  resolvers,     // The updated resolvers for handling workouts and exercises
});

const app = express();

// Create a new instance of Apollo Server and start it asynchronously
const startApolloServer = async () => {
  await server.start(); // Ensure the ApolloServer starts properly

  app.use(express.urlencoded({ extended: false })); // Middleware to parse URL-encoded data
  app.use(express.json()); // Middleware to parse JSON bodies

  // Apollo Server middleware to handle GraphQL queries at the `/graphql` endpoint
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware, // Auth middleware to add user to context (for authentication)
  }));

  // Serve static files in production (like if you're serving a React app in the client folder)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Any other routes should fallback to the React app's index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Database connection and server startup
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Call the async function to start the Apollo server
startApolloServer();


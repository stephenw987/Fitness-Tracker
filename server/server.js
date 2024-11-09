const express = require('express');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 2001;

// Create a new ApolloServer instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable introspection
  playground: process.env.NODE_ENV !== 'production', // Enable playground for non-production environments
  csrfPrevention: false,  // Disable CSRF protection temporarily for testing
});

const app = express();

// Log function to trace the flow
const startApolloServer = async () => {
  try {
    // Log to confirm server start
    console.log("Starting Apollo Server...");

    await server.start();
    console.log("Apollo Server started!");

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Set up Apollo server middleware for GraphQL requests
    app.use('/graphql', expressMiddleware(server, {
      context: authMiddleware
    }));

    // Serve static files in production
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }

    // Log before trying to connect to the database
    console.log("Connecting to the database...");

    // Connect to MongoDB and start the server
    db.once('open', () => {
      // After DB connection is open, start the server
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });
    });
  } catch (error) {
    console.error("Error starting Apollo Server: ", error);
  }
};

// Start the server
startApolloServer();

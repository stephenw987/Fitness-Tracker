const express = require('express'); 
const cors = require('cors'); 
const { graphqlHTTP } = require('express-graphql'); 
const connectDB = require('./config/db'); 
const schema = require('./routes/graphql'); 

const app = express(); 
const PORT = process.env.PORT || 5002; 

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); 
app.use(express.json()); 

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema, 
  graphiql: true, 
}));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log server start message
});

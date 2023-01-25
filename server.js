const path = require('path');
const express = require('express');

const routes = require('./controllers');

const exphbs = require('express-handlebars');
const hbs = exphbs.create();

require('dotenv').config();


// Import ApolloServer
const { ApolloServer } = require('apollo-server-express');
// Import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');

const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');


// Port and App
const PORT = process.env.PORT || 3001;
const app = express();

// Server for io
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// Apollo Server
const startServer = async () => {
  // Create a new Apollo server and pass in our schema data
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  });

  // Start the Apollo server
  await server.start();

  // Integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  // Log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
}

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Turn on routes
app.use(routes);

// Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Socket.io
io.on('connection', (socket) => {
  socket.on('envelope', (envelope) => {
    io.emit('envelope', envelope);
  });
});


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
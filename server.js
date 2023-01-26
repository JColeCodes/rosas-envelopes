const path = require('path');
const express = require('express');

const routes = require('./controllers');

const sequelize = require('./config/connection');
const session = require('express-session');
const exphbs = require('express-handlebars');
const hbs = exphbs.create();

require('dotenv').config();


// Port and App
const PORT = process.env.PORT || 3001;
const app = express();

// Server for io
const server = require('http').createServer(app);
const io = require('socket.io')(server);


const SequelizeStore = require('connect-session-sequelize')(session.Store);
// Setup for cookies use
const sess = {
  secret: process.env.SECRET_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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


// Turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});
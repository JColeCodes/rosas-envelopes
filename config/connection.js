const mongoose = require( 'mongoose' );

mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/rosas-envelopes', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // !! MongoParseError: options usecreateindex, usefindandmodify are not supported
  // useCreateIndex: true,
  // useFindAndModify: false
} );

module.exports = mongoose.connection;

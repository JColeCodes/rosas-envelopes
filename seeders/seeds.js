const db = require('../config/connection');
const { User } = require('../models');

db.once('open', async () => {
  await User.deleteMany({});

  // create user data
  const userData = [];

  const saffrom = { username: 'saffrom', password: '1234' };
  const drgluon = { username: 'drgluon', password: '1234' };

  userData.push(saffrom, drgluon);

  const createdUsers = await User.collection.insertMany(userData);

  console.log('all done!');
  process.exit(0);
});

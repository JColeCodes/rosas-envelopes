const { User } = require('../models');

const userData = [
  {
    username: 'saffrom',
    password: '1234',
  },
  {
    username: 'drgluon',
    password: '1234',
  },
];

const seedUsers = () => User.bulkCreate(userData, { individualHooks: true });

module.exports = seedUsers;
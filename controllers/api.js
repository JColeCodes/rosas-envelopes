const router = require('express').Router();
const { User } = require('../models');

// Get all users
router.get('/users', (req, res) => {
  User.findAll({
    attributes: [ 'username' ]
  })
    .then((dbUserData) => res.json(dbUserData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Login
router.post('/users/login', (req, res) => {
    User.findOne({
        where: { username: req.body.username }
    }).then((dbUserData) => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user found with that username' });
            return;
        }

        // Check password validity
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }
        // Save session data and set status to loggedIn true
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            
            res.json({ user: dbUserData, message: 'Login successful' });
        });
    });
});

// Destroy the session on logout
router.post('/users/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

module.exports = router;
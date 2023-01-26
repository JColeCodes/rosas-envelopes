const router = require('express').Router();

require('dotenv').config();

router.get(('/'), (req, res) => {
    if (!req.session.loggedIn) {
        res.render('login');
    } else {
        res.render('dashboard');
    }
});

router.get('*', (req, res) => {
    res.redirect('/');
});

module.exports = router;
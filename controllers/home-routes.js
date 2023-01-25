const router = require('express').Router();

require('dotenv').config();

router.get(('/'), (req, res) => {
    res.render('login');
});

router.get('*', (req, res) => {
    res.redirect('/');
});

module.exports = router;
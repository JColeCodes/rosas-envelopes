const router = require('express').Router();
const { Envelope } = require('../models');

require('dotenv').config();

router.get(('/'), (req, res) => {
    if (!req.session.loggedIn) {
        res.render('login');
    } else {
        res.render('dashboard');
    }
});

router.get(('/add'), (req, res) => {
    if (!req.session.loggedIn) {
        res.render('login');
    } else {
        Envelope.findAll()
        .then((envelopeData) => {
            const envelopes = envelopeData.map(envelope => envelope.get({ plain: true }));
            res.render('add', {
                envelopes
            });
        })
        // Error catch for Envelope.findAll
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

router.get(('/stream-control'), (req, res) => {
    if (!req.session.loggedIn) {
        res.render('login');
    } else {
        res.render('stream');
    }
});

router.get(('/envelopes'), (req, res) => {
    res.render('stream');
});

router.get(('/deliveries'), (req, res) => {
    res.render('stream');
});

router.get('*', (req, res) => {
    res.redirect('/');
});

module.exports = router;
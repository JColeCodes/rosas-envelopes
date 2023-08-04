const router = require('express').Router();
const { Envelope, User } = require('../models');

const multer = require('multer');
const fs = require('fs');

// MULTER stuff
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/assets/images/uploads');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
});
const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb("Please upload only images.", false);
    }
};
const upload = multer({ storage: storage, fileFilter: imageFilter });


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

// Get all envelopes
router.get('/envelopes', (req, res) => {
  Envelope.findAll({
    attributes: [ 'envelope_text' ]
  })
    .then((dbEnvelopeData) => res.json(dbEnvelopeData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Create envelope text
router.post('/envelopes/add', (req, res) => {
    /* Expects: {
        "envelope_text": "Lorem ipsum"
    } */
    Envelope.create(req.body)
    .then((dbEnvelopeData) => {
        res.json(dbEnvelopeData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Upload envelope image
router.post('/envelopes/img', upload.single('uploadimg'), (req, res) => {
    /* Expects: {
        "envelope_text": "img.png"
    } */
    console.log(req.file);
    Envelope.create({
        envelope_text: `FILENAME=${req.file.filename}`
    })
    .then((dbEnvelopeData) => {
        const envelopes = dbEnvelopeData.get({ plain: true });
        res.redirect('/add');
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Remove envelope
router.delete('/envelopes/remove/:id', (req, res) => {
    if (req.body.envelope_text) {
        fs.unlink(`./public/assets/images/uploads/${req.body.envelope_text}`, (err) => {
            if (err) { 
                console.error(err);
                return;
            }
        });
    }
    
    Envelope.destroy({
        where: {
            id: req.params.id
        }
    })
    .then((dbEnvelopeData) => {
        if (!dbEnvelopeData) {
            res.status(404).json({ message: 'No envelope found with this id' });
            return;
        }
        res.json(dbEnvelopeData);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

// client.defaults.ssl = true;

var date = new Date();
var data = {
    title: 'Bookmarking',
    lastUpdated: date.toDateString(),
    subtitle: 'Bookmarking application and API.'
};

/** GET login page. */
router.get('/', function(req, res, next) {
    data.message = "";
    if (req.session.username) {
        res.redirect('/');
    }
    else {
        res.render('login', data);
    }
});

/** GET logout */
router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
});

/** POST login */
router.post('/', function(req, res, next) {
    if (req.session.username) {
        // Already logged in.
        return res.redirect('/');
    }
    else {
        // Set the sessions.
        if (!req.body.username || !req.body.username) {
            data.message = 'Missing username or password';
            return res.render('login', data);
            // return res.status(400).send('Missing username or password');
        }
        var username = req.body.username;
        if (username === 'BruceHad' && bcrypt.compareSync(req.body.password, '$2a$10$ER.ePDWrL0laXxNtikhIE.44xARIT.PSB5yRKtmM1jI7LdjFz5Yke')) {
            req.session.username = req.body.username;
            return res.redirect('/');
        }
        else {
            data.message = 'Username or password incorrect';
            return res.render('login', data);
            // return res.status(400).send('Username or password incorrect');
        }
    }
});


module.exports = router;

var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');

// client.defaults.ssl = true;

var date = new Date();
var data = {
    title: 'Bookmarking',
    lastUpdated: date.toDateString(),
    subtitle: 'Bookmarking application and API.',
    loggedIn: false
};

/** GET home page. */
router.get('/', function(req, res, next) {
    // Get most recent 10 bookmarks from db
    console.log('Cookies: ', req.cookies);
    res.render('login', data);
});

/** POST login
 */
router.post('/', function(req, res, next) {
    if (req.cookies.loggedIn) {
        // Already logged in.
        return res.redirect('/index');
    }
    else {
        // Set the sessions.
        if(! req.body.username || ! req.body.username){
            return res.status(400).send('Missing username or password');
        }
        var username = req.body.username;
        // var salt = bcrypt.genSaltSync(10);
        // var hash = bcrypt.hashSync(req.body.password, salt);
        if(username === 'BruceHad' && bcrypt.compareSync(req.body.password, '$2a$10$ER.ePDWrL0laXxNtikhIE.44xARIT.PSB5yRKtmM1jI7LdjFz5Yke')){
            res.cookie('loggedIn', true, { maxAge: 900000, httpOnly: true });
            return res.redirect('/index');
        }
        else {
            return res.status(400).send('Username or password incorrect');
        }
    }
});


module.exports = router;

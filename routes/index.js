var express = require('express');
var router = express.Router();
var pg = require('pg');
pg.defaults.ssl = true;
var account = require('../models/account.js');
var bookmarks = require('../models/bookmarks.js');
var connectionString = process.env.DATABASE_URL;





// Home Page
// ---------
router.get('/', function(req, res, next) {
  var data = {
    loggedIn: req.session.loggedIn,
    username: req.session.username,
  };
  bookmarks.recent(res, data);
});

router.post('/', function(req, res, next) {
  bookmarks.add(res, req.body);
});






// Registration
// ------------

// router.get('/registration', function(req, res) {
//     res.render('registration', { });
// });

// router.post('/registration', function(req, res) {
// });

router.get('/login', function(req, res) {
  res.render('login');
});

router.post('/login', function(req, res) {
  account.login(res, req.body, function(login, data){
    if(login){
      req.session.loggedIn = true;
      req.session.username = data.username;
      res.redirect('/');
    } else {
      req.session.loggedIn = false;
      res.render('login', {error: "Could not log you in"});
    }
  });
});

router.get('/logout', function(req, res) {
    req.session.loggedIn = false;
    req.session.username = null;
    res.redirect('/');
});


// Init
// ----

router.get('/init', function(req, res) {
  // Initialise bookmarks table in database if it doesn't exist
  pg.connect(connectionString, function(err, client) {
    if (err) console.error(err);
    else {
      client.query(sql)
      .on('error', function(error){console.error(error);})
      .on('end', function(result) {
        client.end();
        console.log(result);
        res.send('done');
      });
    }
  });
});

module.exports = router;

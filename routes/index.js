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
  if(data.loggedIn){
    bookmarks.recent({number: 10}, function(results){
      data.rows = results.rows;
      res.render('index', data);
    });
  }
  else {
    res.render('index', data);
  }
});

router.post('/', function(req, res, next) {
  bookmarks.add(res, req.body);
});




// API
// ---
router.get('/api/recent/*', function(req, res, next) {
  // set default
  var n = req.params[0];
  if (!(n > 0 && n <=100)) n = 10;
  bookmarks.recent({number: n}, function(data){
    res.send(JSON.stringify(data.rows));
  });
});

router.get('/api/categories', function(req, res, next) {
  bookmarks.categories({}, function(data){
    res.send(JSON.stringify(data.rows));
  });
});

router.get('/api/all_months', function(req, res, next) {
  bookmarks.months({}, function(data){
    res.send(JSON.stringify(data.rows));
  });
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

router.get('/logout', function(req, res) {
    req.session.loggedIn = false;
    req.session.username = null;
    res.redirect('/');
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

module.exports = router;

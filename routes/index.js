var express = require('express');
var router = express.Router();
// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database(  'http://treerock.me/trlbdb');

// db.serialize(function(){
//   db.run('CREATE TABLE IF NOT EXISTS links (url text, name text, description text, category text, date text)');
// });
var pg = require('pg');
pg.defaults.ssl = true;
var connectionString = process.env.DATABASE_URL;

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {};
  data.title = "tr/lb";
  data.loggedIn = true;
  res.render('index', data);
});

router.post('/', function(req, res, next) {
  var dbData = req.body;

  var today = new Date();

  var sql = "INSERT INTO bookmarks VALUES ('"
  + dbData.url+"', '"
  + dbData.name+"', '"
  + dbData.description+"', '"
  + dbData.category+"', CURRENT_TIMESTAMP)";

  pg.connect(connectionString, function(err, client) {
    if (err) console.error(err);
    else {
      client
      .query(sql)
      .on('error', function(error){console.error(error);})
      .on('end', function(result){
        console.log(result);
        client.end();
      });
    }
  });

  data = {};
  data.title = "tr/lb";
  data.loggedIn = true;
  res.render('index', data);
});

router.get('/init', function(req, res) {
  // Initialise bookmarks table in database if it doesn't exist
  var sql ='CREATE TABLE IF NOT EXISTS bookmarks (bookmark_url text, bookmark_name text, description text, category text, bookmark_date text);';
  pg.connect(connectionString, function(err, client) {
    if (err) console.error(err);
    else {
      console.log('connected')
      client
      .query(sql)
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

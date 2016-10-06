var express = require('express');
var router = express.Router();
var pg = require('pg');
pg.defaults.ssl = true;
var connectionString = process.env.DATABASE_URL;
// var connectionString = "pg://postgres:password@localhost:5432/mydb";

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = {};
  data.loggedIn = true;
  console.log(connectionString);

  // Get most recent 10 bookmarks from db
  var sql = "SELECT bookmark_url, bookmark_name, description, category, bookmark_date \
FROM bookmarks ORDER BY bookmark_date desc LIMIT 10";
  pg.connect(connectionString, function(err, client, done) {
    if (err) {
      console.error(err);
    }
    else {
      client.query(sql)
      .on('row', function(row, results) {
        results.addRow(row);
      })
      .on('end', function(results) {
        data.rows = results.rows;
        console.log(results.rows.length + ' rows were received');
        res.render('index', data);
      });
    }
    done();
  });
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

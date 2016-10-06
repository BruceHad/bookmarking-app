var express = require('express');
var router = express.Router();
var pg = require('pg');
pg.defaults.ssl = true;
// var connectionString = process.env.DATABASE_URL;
var connectionString = 'pg://postgres:password@localhost:5432/mydb';


/* GET db info (recent) */
router.get('/', function(req, res, next) {
  var data = {title: "tr/lb", loggedIn: true};
  console.log("Hello", connectionString);


  var sql = "SELECT bookmark_url, bookmark_name, description, category, bookmark_date \
FROM bookmarks ORDER BY bookmark_date desc LIMIT 10";
  pg.connect(connectionString, function(err, client, done) {
    if (err) console.error(err);
    else {
      client
      .query(sql)
      .on('row', function(row, results) {
        results.addRow(row);
      })
      .on('end', function(results) {
        data.rows = results.rows;
        console.log(results.rows.length + ' rows were received');
        res.render('db', data);
      });
    }
    done();
  });
});

/* GET categories */
router.get('/categories', function(req, res, next){
  var data = {title: "tr/lb", loggedIn: true};
  var sql = "SELECT category, '../api/category/'||lower(category) as link, count(*) FROM bookmarks GROUP BY category ORDER BY category;";
  pg.connect(connectionString, function(err, client, done){
    if(err) console.error(err);
    if(client){
      client.query(sql, function(err, results){
        done();
        if(err) console.error(err);
        else{
          data.rows = results.rows;
          console.log(results.rows);
          res.render('categories', data);
        }
      });
    }
  });
});

/* GET Months */
router.get('/months', function(req, res, next){
  var data = {title: "tr/lb", loggedIn: true};
  var sql = "SELECT DISTINCT substring(bookmark_date from 0 for 8) bookmark_month,'../api/month/'||substring(bookmark_date from 0 for 5)||'/'||substring(bookmark_date from 6 for 2) link FROM bookmarks ORDER BY substring(bookmark_date from 0 for 8);";
  pg.connect(connectionString, function(err, client, done){
    if(err) console.error(err);
    if(client){
      client.query(sql, function(err, results){
        done();
        if(err) console.error(err);
        else{
          data.rows = results.rows;
          res.render('months', data);
        }
      });
    }
  })
});

module.exports = router;

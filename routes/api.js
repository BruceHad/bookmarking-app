var express = require('express');
var router = express.Router();
var pg = require('pg');
pg.defaults.ssl = true;
var connectionString = process.env.DATABASE_URL;

 var sqlRecent = "SELECT bookmark_url, bookmark_name, description, category, bookmark_date \
FROM bookmarks ORDER BY bookmark_date desc LIMIT 10";

/* API Home Page */
router.get('/', function(req, res, next) {
  var data = {};
  data.title = "tr/lb";
  data.loggedIn = true;
  res.render('api', data);

});

/* GET recent listing. */
router.get('/recent', function(req, res, next) {

  pg.connect(connectionString, function(err, client) {
    if (err) console.error(err);
    else {
      client
      .query(sqlRecent)
      .on('row', function(row, result) {
        result.addRow(row);
      })
      .on('end', function(result) {
        console.log(result.rows.length + ' rows were received');
        res.send(JSON.stringify(result.rows))
      });
    }
  });
});

module.exports = router;

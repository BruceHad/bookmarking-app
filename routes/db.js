var express = require('express');
var router = express.Router();
var pg = require('pg');
pg.defaults.ssl = true;
var connectionString = process.env.DATABASE_URL;



/* GET db info. */
router.get('/', function(req, res, next) {
  var data = {};
  data.title = "tr/lb";
  data.loggedIn = true;

  var sql = "SELECT bookmark_url, bookmark_name, description, category, bookmark_date \
FROM bookmarks ORDER BY bookmark_date desc LIMIT 10";
  pg.connect(connectionString, function(err, client) {
    if (err) console.error(err);
    else {
      client
      .query(sql)
      .on('row', function(row, result) {
        result.addRow(row);
      })
      .on('end', function(result) {
        data.rows = result.rows;
        // console.log(result.rows);
        console.log(result.rows.length + ' rows were received');
        res.render('db', data);
      });
    }
  });
});

module.exports = router;

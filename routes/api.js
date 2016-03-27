var express = require('express');
var router = express.Router();
var pg = require('pg');
pg.defaults.ssl = true;
var connectionString = process.env.DATABASE_URL;



/* GET recent listing. */
router.get('/recent', function(req, res, next) {
  var sql = "SELECT bookmark_url, bookmark_name, description, category, bookmark_date \
FROM bookmarks ORDER BY bookmark_date desc LIMIT 10";
  pg.connect(connectionString, function(err, client, done) {
    if (!err) {
      console.log("Connected");
      client.query(sql)
      .on('row', function(row, results) {
        results.addRow(row);
      })
      .on('end', function(results) {
        console.log(results.rows.length + ' rows were received');
        res.send(JSON.stringify(results.rows));
      });
    }
    done();
  });
});

/* Get category listing */
router.get('/category/:cat', function(req, res, next){
  console.log(req.params);
  var cat = req.params.cat;
  var sql = "SELECT * FROM bookmarks WHERE upper(category) = upper('"+cat+"');";
  console.log(sql);
  pg.connect(connectionString, function(err, client, done){
    if(err) console.error(err);
    else{
      client.query(sql, function(err, results){
        done();
        if(err) console.error(err);
        else{
          console.log(results.rows.length + ' rows were received');
          res.send(JSON.stringify(results.rows));
        }
      });
    }
  })
});

/* Get Monthly Listing */


module.exports = router;

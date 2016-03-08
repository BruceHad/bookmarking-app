var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('trlbdb');

var sql = "\
SELECT \
  links.url, \
  links.name, \
  links.description, \
  links.category, \
  links.date \
FROM links \
ORDER BY links.date desc \
LIMIT 10 \
";

/* GET db info. */
router.get('/', function(req, res, next) {
  var data = {};
  data.title = "tr/lb";
  data.loggedIn = true;

  db.all(sql, function(err, rows){
        if(err) console.error(err);
        else {
          data.rows = rows;
          console.log(rows);
          res.render('db', data);
        }
  });


});

module.exports = router;

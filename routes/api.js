var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('trlbdb');

var sqlRecent = "\
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

/* API Home Page */
router.get('/', function(req, res, next) {
  var data = {};
  data.title = "tr/lb";
  data.loggedIn = true;
  res.render('api', data);

});

/* GET recent listing. */
router.get('/recent', function(req, res, next) {
  db.all(sqlRecent, function(err, rows){
    if(err) console.error(err);
    else {
      res.send(JSON.stringify(rows));
    }
  });


});

module.exports = router;

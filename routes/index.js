var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('trlbdb');

db.serialize(function(){
  db.run('CREATE TABLE IF NOT EXISTS links (url text, name text, description text, category text, date text)');
});

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
  var sql = 'INSERT INTO links VALUES ("'
    + dbData.url+'", "'
    + dbData.name+'", "'
    + dbData.description+'", "'
    + dbData.category+'", "'
    + today.toISOString()+'")';
  db.run(sql, function(err){
        if(err) console.log(err);
        else console.log("data inserted???")
  });
  data = {};
  data.title = "tr/lb";
  data.loggedIn = true;
  res.render('index', data);
});

module.exports = router;

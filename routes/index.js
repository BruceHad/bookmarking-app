var express = require('express');
var router = express.Router();
var sql = require('../models/model');
var { Client } = require('pg');
var connectionString = process.env.DATABASE_URL;

// client.defaults.ssl = true;

var date = new Date();
var data = {
    title: 'Bookmarking',
    lastUpdated: date.toDateString(),
    subtitle: 'Bookmarking application and API.',
    loggedIn: false
};

/** GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session.username);
    if (req.session.username) {
        data.loggedIn = true;
        data.username = req.session.username;
    } else {
        data.loggedIn = false;
        data.username = null;
    }
    // Get most recent 10 bookmarks from db
    var client = new Client({ connectionString: connectionString, });
    client.connect();
    client.query(sql.recent, [10], function(error, response) {
        if (error) {
            data.message = 'Couldn\'t connect to db: ';
            data.error = error;
        }
        else {
            data.rows = response.rows;
        }
        client.end();
        res.render('index', data);
    });
});

/** POST bookmark
 */
router.post('/', function(req, res, next) {
    if (! req.session.username) {
        return res.status(400).send('Not logged in!');
    }
    // Get insert SQL query
    var db = req.body;
    // Insert data into db.
    var client = new Client({ connectionString: connectionString, });
    client.connect();
    client.query(sql.insert, [db.url, db.name, db.description, db.category], function(error, response) {
        client.end();
        if (error) {
            return res.send(error);
        }
        else {
            return res.redirect('/');
        }
    });
});

/** Initialise database table */
router.get('/init', function(req, res) {
    if (! req.session.username) {
        return res.status(400).send('Not logged in!');
    }
    var client = new Client({ connectionString: connectionString, });
    client.connect();
    client.query(sql.init, function(error, response) {
        client.end();
        if (error) {
            return res.send(error);
        }
        else {
            return res.redirect('/');
        }
    });
});

/** GET categories JSON */
router.get('/api/categories', function(req, res) {
    var client = new Client({ connectionString: connectionString, });
    client.connect();
    client.query(sql.categories, function(error, response) {
        client.end();
        if (error) {
            return res.send(error);
        }
        else {
            return res.send(JSON.stringify(response.rows)); 
        }
    });
});

/** GET recent n bookmarks JSON */
router.get('/api/recent/:number?', function(req, res, next) {
    var n = req.params.number || 10; // default to 10
    var client = new Client({ connectionString: connectionString, });
    client.connect();
    client.query(sql.recent, [n], function(error, response) {
        client.end();
        if (error) {
            return res.send(error);
        }
        else {
            return res.send(JSON.stringify(response.rows));
        }
    });
});

/** GET range n1 to n2 bookmarks JSON */
router.get('/api/range/:from-:to', function(req, res, next) {
    var n1 = Number(req.params.from);
    var n2 = Number(req.params.to);
    if(n2 <= n1){
        res.send("Error in range parameters");
    }
    var limit = n2 - n1 + 1; // limit number of records
    var offset = n1 - 1; // offset limit
    var client = new Client({ connectionString: connectionString, });
    client.connect();
    client.query(sql.range, [limit, offset], function(error, response) {
        client.end();
        if (error) {
            return res.send(error);
        }
        else {
            return res.send(JSON.stringify(response.rows));
        }
    });
});

module.exports = router;

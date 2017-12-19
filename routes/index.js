var express = require('express');
var router = express.Router();
var sql = require('../models/model');
var { Pool, Client } = require('pg')
var connectionString = process.env.DATABASE_URL || 'postgres://ubuntu:pgpass@localhost:5432/bm';

// client.defaults.ssl = true;

var date = new Date();
var data = {
    title: 'Bookmarking',
    lastUpdated: date.toDateString(),
    subtitle: 'Bookmarking application and API.'
};

data.loggedIn = true; // remove before pushing to live

/** GET home page. */
router.get('/', function(req, res, next) {
    // Get most recent 10 bookmarks from db
    var client = new Client({ connectionString: connectionString, });
    client.connect();
    client.query(sql.recent, function(error, response) {
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
    // Get insert SQL query
    var db = req.body;
    var insert = sql.getInsert(db.url, db.name, db.description, db.category);

    // Insert data into db.
    var client = new Client({ connectionString: connectionString, });
    client.connect();
    client.query(insert, function(error, response) {
        client.end();
        if (error) {
            res.send(error);
        }
        else {
            res.redirect('/');
        }
    });
});

/** Initialise database table */
router.get('/init', function(req, res) {
    var client = new Client({ connectionString: connectionString, });
    client.connect();
    client.query(sql.init, function(error, response) {
        client.end();
        if (error) {
            res.send(error);
        }
        else {
            res.redirect('/');
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
            res.send(error);
        }
        else {
            res.send(JSON.stringify(response.rows)); 
        }
        client.end();
    });
});

/** GET recent n bookmarks JSON */
router.get('/api/recent/:number?', function(req, res, next) {
    var n = req.params.number || 10; // default to 10
    var recent = sql.getRecent(n);
    var client = new Client({ connectionString: connectionString, });
    client.connect();
    client.query(recent, function(error, response) {
        if (error) {
            res.send(error);
        }
        else {
            res.send(JSON.stringify(response.rows));
        }
        client.end();
    });
});

module.exports = router;

var pg = require('pg');
pg.defaults.ssl = true;
var connectionString = process.env.DATABASE_URL;

var bookmarks = {};


// Reading
// -------

// Get most recent n bookmarks from db
bookmarks.recent = function(params, next) {
    var n = params.number;
    var sql = "SELECT bookmark_url, bookmark_name, description, category, bookmark_date FROM bookmarks ORDER BY bookmark_date desc LIMIT " + n;
    pg.connect(connectionString, function(err, client) {
        if (err) {
            console.error(err);
        } else {
            client.query(sql)
                .on('row', function(row, results) {
                    results.addRow(row);
                })
                .on('end', function(results) {
                    client.end();
                    next(results);
                });
        }
    });
};
// Get categories
bookmarks.categories = function(params, next) {
    var sql = "SELECT DISTINCT category FROM bookmarks ORDER BY category;";
    pg.connect(connectionString, function(err, client) {
        if (err) {
            console.error(err);
        } else {
            client.query(sql)
                .on('row', function(row, results) {
                    results.addRow(row);
                })
                .on('end', function(results) {
                    client.end();
                    next(results);
                });
        }
    });
};


bookmarks.months = function(params, next) {
    var sql = "SELECT DISTINCT substring(bookmark_date from 0 for 8) bookmark_month,'../api/month/'||substring(bookmark_date from 0 for 5)||'/'||substring(bookmark_date from 6 for 2) link FROM bookmarks ORDER BY substring(bookmark_date from 0 for 8);";
    pg.connect(connectionString, function(err, client) {
        if (err) {
            console.error(err);
        } else {
            client.query(sql)
                .on('row', function(row, results) {
                    results.addRow(row);
                })
                .on('end', function(results) {
                    client.end();
                    next(results);
                });
        }
    });
};





// Writing
// -------


// Add
bookmarks.add = function(res, data) {
    var today = new Date();
    console.log(data.url);
    var sql = "INSERT INTO bookmarks VALUES ('" +
        data.url + "', '" +
        data.name + "', '" +
        data.description + "', '" +
        data.category + "', CURRENT_TIMESTAMP)";

    pg.connect(connectionString, function(err, client) {
        if (err) console.error(err);
        else {
            client
                .query(sql)
                .on('error', function(error) {
                    console.error(error);
                })
                .on('end', function(result) {
                    console.log(result);
                    client.end();
                    res.redirect('back');
                });
        }
    });

};

module.exports = bookmarks;
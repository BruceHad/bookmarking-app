var pg = require('pg');
pg.defaults.ssl = true;
var connectionString = process.env.DATABASE_URL;

var bookmarks = {};

// Get most recent 10 bookmarks from db
bookmarks.recent = function(res, data, next) {
    var sql = "SELECT bookmark_url, bookmark_name, description, category, bookmark_date FROM bookmarks ORDER BY bookmark_date desc LIMIT 10";
    pg.connect(connectionString, function(err, client) {
        if (err) {
            console.error(err);
        } else {
            client.query(sql)
                .on('row', function(row, results) {
                    results.addRow(row);
                })
                .on('end', function(results) {
                    data.rows = results.rows;
                    res.render('index', data);
                    client.end();
                });
        }
    });
};

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
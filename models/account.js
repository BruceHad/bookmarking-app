var pg = require('pg');
pg.defaults.ssl = true;
var connectionString = process.env.DATABASE_URL;
var passwordHash = require('password-hash');

account = {};
account.connectionString = connectionString;

account.login = function(res, data, login) {
    // Verify that the username and password match.
    var sql = "select password from users where username = '" + data.username + "';";

    pg.connect(connectionString, function(err, client) {
        if (err) console.error(err);
        else {
            client.query(sql, function(row, results) {
                console.log(results.rows[0]);
                if(results.rows[0]){
                    var verified = passwordHash.verify(data.password, results.rows[0].password);
                    if(verified){
                        login(true, {username: data.username});
                    } else {
                        login(false);
                    }
                }
                else{
                    login(false);
                }
            });
        }
    });
}

module.exports = account;
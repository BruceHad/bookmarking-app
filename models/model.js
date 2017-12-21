var models = {};

/** Queries */
models.init = "CREATE TABLE IF NOT EXISTS bookmarks ( \
    bookmark_url text \
    , bookmark_name text \
    , description text \
    , category text \
    , bookmark_date text) \
;";

models.recent = "SELECT \
    bookmark_url \
    , bookmark_name\
    , description \
    , category \
    , bookmark_date \
FROM bookmarks \
ORDER BY bookmark_date desc LIMIT $1;";

models.insert = "INSERT INTO bookmarks \
VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP);";

//models.categories = "SELECT category, '../api/category/'||lower(category) as link, count(*) FROM bookmarks GROUP BY category ORDER BY category;"; // old
models.categories = "SELECT category FROM bookmarks GROUP BY category ORDER BY category;";



// models.getRecent = function(n){
//     return models.recent = "SELECT \
//         bookmark_url \
//         , bookmark_name\
//         , description \
//         , category \
//         , bookmark_date \
//     FROM bookmarks \
//     ORDER BY bookmark_date desc LIMIT " + n +";";
// };

module.exports = models;
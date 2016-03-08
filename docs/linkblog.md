# Linkblog

February 2016

_(Learning Project)_

_Application:_

An application for 'bookmarking' webpage links and displaying those links as a form of ['linkblog'](https://en.wikipedia.org/wiki/Linklog).

There are two elements to the application: the bookmarking 'app', which provides an online interface for saving links to webpages, storing them in a database. The app provides a web API for accessing to those links; and the 'linkblog' which provides users access to view and browse those links.

## The Bookmarking App

The bookmaring app is a NodeJS, Express application with an SQLite backend. The main interface allows user to enter a URL, Name, Description, Category and (future) image. 

## The API

This information is then stored in the database. The web API provides a few endpoints to access the links, such as:

- /recent -- the most recent n links bookmarked.
- /category/catname -- the most recent n links in the catname category
- /monthly?year=2006&month=01 -- all links bookmarked in January 2016.

## The Linkblog

The linkblog is a single page, javascript application for showing and browsing the links. It retrieves the data from the App api and formats it for display. It also provides means to navigate the data, e.g. category links.

## Deployment

Apparently can't really deploy on shared hosting, so looking at heroku instead.

https://devcenter.heroku.com/articles/getting-started-with-nodejs

Install the Heroku Toolbelt. This provides you access to the Heroku Command Line Interface (CLI).

Then login with heroku username and password.

  heroku login

Next you need a functioning git repository with the appropriate package.json file (for node).

Create a heroku app:

  heroku create

A git remote is created (called heroku) and associated with your local git repository. A random name is generated, or you can specify your own name.

Now deploy your code:

  git push heroku master

Run the app:

  heroku ps:scale web=1

And you can now open it:

  heroku open

You can also run an app locally. First install the dependencies locally. Then start up the service.

  npm install
  heroku local web

From that point on, you can use git to deploy any changes.

  git push heroku master





## DB

SQLite is a serverless, zero config, transactional SQL database engine. Seems quite easy to install and use with NodeJS.

    npm install --save sqlite3

Then.

    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(':memory:');

And: 

    db.serialize(function() {
      db.run("CREATE TABLE lorem (info TEXT)");
     
      var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
      for (var i = 0; i < 10; i++) {
          stmt.run("Ipsum " + i);
      }
      stmt.finalize();
     
      db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
          console.log(row.id + ": " + row.info);
      });
    });
     
    db.close();

So a new database is created with filename :memory: which indicates a "anonymous in-memory database". (You can also have an anonymous disk-based datbase by leaving it empty).

db.prepare(sql, param, callback) prepares the SQL statement and (optionally) binds the specified parameters and calls the callback when done.

This seems to be used when setting up an SQL statement programatically.

stmt.finalize() - finalises the statement.

db.each(sql, param, callback) - runs the SQL and calls the callback for each result.

db.run(sql, param, callback) runs the SQL query with the specified parameters and calls the callback afterwards.

## Express

Express Generator set up a base project. I only need a single page which contains a form with URL, Name, Description, Category and Tags.


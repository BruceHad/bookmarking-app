# Bookmarking App

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
- /all_months -- Provide a list of available months

## Deployment

Apparently can't really deploy on shared hosting (or it looks rather difficult). Heroku seems to be a common alternative (and rpovides free 'hobby' accounts.

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

### The DB

After looking at MongoDB and SQLite, it seems that postgres will be the simpler choice for deployment purposes, as that seems to be the default add-on for Heroku.

https://devcenter.heroku.com/articles/heroku-postgresql

PostreSQL (postgres) is an object-relational database management system, which is similar to a relational database but with a OO database model (objects, classes and inheritance is supported in the db and query language).

Heroku postgres is the SQL database service run by Heroku. Managed as an 'add on', it accessible from Node.

Many buildpacks provision a Heroku Postgres instance automatically. If not, you can create a new db using the CLI.

### Creating a new database

To provision a hobby plan db:

    heroku addons:create heroku-postgresql:hobby-dev

You can use pg:wait to track status.

    heroku pg:wait

Once Heroku Postgres has been added a DATABASE_URL or HEROKU_POSTGRESQL_COLOR_URL setting will be available in the app config.

    heroku config -s | grep HEROKU_POSTGRESQL
    heroku config -s | grep DATABASE_URL

### Local Setup

Heroku recommends running the same database locally during development as in production.

Install Postgres:

https://www.howtoforge.com/tutorial/postgresql-on-ubuntu-15-04/

    sudo apt-get install postgresql postgresql-contrib
    which psql
    > /usr/bin/psql

Also install pgadmin:

    sudo apt-get install pgadmin3

PG uses _role_ for authentication and authorisation, similar to unix permissions. By default, it creates a new user called postgres. You need to log in to that account:

    sudo su
    su - postgres

This switches you first to the root user, then the postgres user.

Then we need to set the password for the postgres user role (called "postgres"), to allow us to access the server externally.

    psql
    psql (9.3.11)
    postgres=#  \password postgres
    ENTER YOUR PASSWORD
    \q
    exit
    exit

Now active addon for pgAdmin.

    sudo -u postgres psql
    CREATE EXTENSION adminpack;

Now for Heroku to work, set up a user role that matches your login.

    sudo -u postgres psql
    CREATE role you;
    ALTER ROLE you WITH superuser;
    ALTER ROLE you WITH login;
    ALTER ROLE you PASSWORD 'your password';
    \q

Now you can copy the database from Heroku locally.

    heroku pg:pull DATABASE_URL localherokudb --app appname

Then heroku recommends set the environment variable.

    export DATABASE_URL=postgres:///$(whoami)

But this didn't work for me, as I need a user and password to log in to the database.

    export DATABASE_URL=postgres://you:password@localhost:5432/localherokudb
    export DATABASE_URL=postgres://treerock:treerock@localhost:5432/localherokudb

Note this may need repeating every time, or you can set it up by default.

### Connecting in Node

Install the pg module.

    npm install --save --save-exact pg

In your app, configure the module to default to SSL connection.

    var pg = require('pg');
    pg.defaults.ssl = true;
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (err) throw err;
      console.log('Connected to postgres! Getting schemas...');

      client
        .query('SELECT table_schema,table_name FROM information_schema.tables;')
        .on('row', function(row) {
          console.log(JSON.stringify(row));
        });
    });

### Heroku Connection String

You can retrieve the PG connection string in one of two ways. heroku pg:credentials is discussed above:

 heroku pg:credentials DATABASE

Also, the connection string is exposed as a config var for your app:

 heroku config | grep HEROKU_POSTGRESQL

## Express

Express Generator set up a base project. I only need a single page which contains a form with URL, Name, Description, Category and Tags.

## Postgress and Node

https://github.com/brianc/node-postgres

## CORS

https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
http://stackoverflow.com/questions/11001817/allow-cors-rest-request-to-a-express-node-js-application-on-heroku

A resource makes a cross-origin http request when it requests a resource from a different domain. For security reasons, request from within scripts, e.g. XMLHttpRequests, browser may block such requests.

Cross Origin Resource Sharing (CORS) works by adding new HTTP headers
that allow servers to describe the set of origins that are permitted to read that information.

So it's the server providing the API that controls who can read that information, not the client that controls which domains it can request from.

In node/express app:

    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
          res.send(200);
        }
        else {
          next();
        }
    };

And remember and put in the:

    app.use(allowCrossDomain)


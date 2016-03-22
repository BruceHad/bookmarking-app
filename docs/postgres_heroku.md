# Postgres on Heroku

After looking at MongoDB and SQLite, it seems that postgres will be the simpler choice for deployment purposes, as that seems to be the default add-on for Heroku.

https://devcenter.heroku.com/articles/heroku-postgresql

PostreSQL (postgres) is an object-relational database management system, which is similar to a relational database but with a OO database model (objects, classes and inheritance is supported in the db and query language).

Heroku postgres is the SQL database service run by Heroku. Managed as an 'add on', it accessible from Node.

Many buildpacks provision a Heroku Postgres instance automatically. If not, you can create a new db using the CLI.

## Creating a new database

To provision a hobby plan db:

    heroku addons:create heroku-postgresql:hobby-dev

You can use pg:wait to track status.

    heroku pg:wait

Once Heroku Postgres has been added a DATABASE_URL or HEROKU_POSTGRESQL_COLOR_URL setting will be available in the app config.

    heroku config -s | grep HEROKU_POSTGRESQL
    heroku config -s | grep DATABASE_URL

## Local Setup

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

## Connecting in Node

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

## Heroku Connection String

You can retrieve the PG connection string in one of two ways. heroku pg:credentials is discussed above:

 heroku pg:credentials DATABASE

Also, the connection string is exposed as a config var for your app:

 heroku config | grep HEROKU_POSTGRESQL



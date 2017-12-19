# Linkblog

February 2016

NodeJS Bookmarking application that saves links provides JSON API for accessing the data.

The bookmarking 'app' is an online interface for saving links: URL, Name, Description, Category and image. This information is then stored in the database. 

The interface provides a few JSON endpoints to access the links, such as:

- /recent/n -- the most recent n links bookmarked.
- /cat/catname/n -- the most recent n links in the catname category
- /2016/january -- all links bookmarked in January 2016.

## Objectives:

- Learn about Databases in Node.js (Postgres)
- Learn about deploying NodeJS applications (Heroku).
- Learn API design and usage.

## Technologies:

Javascript, NodeJS, Express, Postgres, API, Heroku
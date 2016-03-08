# Linkblog

February 2016

_(Learning Project)_

## Application:

An application for 'bookmarking' webpage links and displaying those links as a form of ['linkblog'](https://en.wikipedia.org/wiki/Linklog).

This the the first elements of two: the bookmarking 'app', which provides an online interface for saving links to webpages, storing them in a database. 

The bookmarking app is a NodeJS, Express application. The main interface allows user to enter a URL, Name, Description, Category and (future) image. This information is then stored in the database. The web API provides a few endpoints to access the links, such as:

- /recent -- the most recent n links bookmarked.
- /cat/catname -- the most recent n links in the catname category
- /2016/january -- all links bookmarked in January 2016.

## Objectives:

- <del>Learn about MongoDB and 'NoSQL' type storage.</del>
- Learn about Databases in Node.js
- Learn about debloying NodeJS applications.
- Learn API design and usage.

## Technologies:

- Javascript
    - NodeJS
    - Express
- SQLite
- APIs
- Heroku

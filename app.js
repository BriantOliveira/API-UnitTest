/* eslint-disable no-console */
/*
*   Bookstore Tutorial
*   REST API Unit Test
*/

require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const sanitizer = require('sanitize');
const expressSanitizer = require('express-sanitizer');
const bodyParser = require('body-parser');
// const morgan = require('morgan');
const config = require('./config/env');

/** Instantiate the server */
const app = express();

/** Instantiate a PORT number */
const PORT = process.env.PORT || 3000;

/** Import Routes */
const bookRouter = require('./controllers/book');

/** Set up static public directory */
app.use(express.static(path.join(__dirname, '..', 'public')));

/** Middleware */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({  extended: true }));
app.use(sanitizer.middleware);
app.use(expressSanitizer());
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));  

/** Database options */
let options = { 
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }, 
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS : 30000 } } 
}; 

/** MongoDB connection*/
mongoose.Promise = global.Promise;

mongoose.connect(config.db, {useMongoClient: true});
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${config.db}`);
});
mongoose.connection.on('connected', () => {
  console.log(`Connected to database: ${config.db}`);
});

if (config.env === 'development') {
  mongoose.set('debug', true);
}

/** Set up routes */
app.use('/books', bookRouter);

/** Any remaining request with an extension (.js, .css, etc...) send 404 */
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  }

  next();
});

app.listen(PORT, () => {
  console.log('Bookstore listening on port', PORT);
});
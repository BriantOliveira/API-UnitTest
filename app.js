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
// const config = require('./config');

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

mongoose.connect(process.env.DBURI, {useMongoClient: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Connected to the bookstore db sucessfully.')
});

//don't show the log when it is test
// if(config.util.getEnv('NODE_ENV') !== 'test') {
//     //use morgan to log at command line
//     app.use(morgan('combined')); //'combined' outputs the Apache style LOGs
// }

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
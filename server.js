'use strict';

const { PORT } = require('./config');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
//require notes
const notesRouter = require('./routers/notes.router');
//create an Express application
const app = express();

// Log all requests
app.use(morgan('dev'));
//create a static webserver
app.use(express.static('public'));
app.use(bodyParser.json());




// // same as using morgan
// function requestLogger(req, res, next) {
//   const now = new Date();
//   console.log(`${now.toLocaleString()} ${req.method} ${req.url}`);
//   next();
// }

// app.use(requestLogger);

//use notesRouter
app.use(notesRouter);
//404 error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.status(404).json({ message: 'Not Found' });
});

//custom error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});

// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});


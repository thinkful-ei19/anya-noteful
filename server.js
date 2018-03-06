'use strict';

// Simple In-Memory Database
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

const { PORT } = require('./config');


console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');
//const morgan = require('morgan');
const app = express();

app.use(express.static('public'));
app.use(express.json()); // add express middleware 
//app.use(morgan('common'));

app.get('/boom', (req, res, next) => {
  throw new Error('Boom!!');
});



// Listen for incoming connections
app.listen(PORT, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

//return array of notes
app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  const {id} = req.params; // returns string not number

  notes.find(Number(id), (err, item) => {
    if (err) {
      return next(err);
    }
    res.json(item);
  });
  //let newData = data.find(item => item.id === Number(id));
  //res.json(newData);
});


//update notes
app.put('/api/notes/:id', (req, res, next) => {
  const id = req.params.id;

  /***** Never trust users - validate input *****/
  const updateObj = {};
  const updateFields = ['title', 'content'];

  updateFields.forEach(field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});


// same as using morgan
function requestLogger(req, res, next) {
  const now = new Date();
  console.log(`${now.toLocaleString()} ${req.method} ${req.url}`);
  next();
}

app.use(requestLogger);

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



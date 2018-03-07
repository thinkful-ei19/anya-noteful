'use strict';

//require Express
const express = require('express');
//create instance
const router = express.Router();

//Move the simDb initialize code the from server.js to notes.router.js
const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

//return array of notes
router.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;
  
  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err); // goes to error handler
    }
    res.json(list); // responds with filtered array
  });
});

//return a note at specified id
router.get('/api/notes/:id', (req, res, next) => {
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
router.put('api/notes/:id', (req, res, next) => {
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

// Post (insert) an item
router.post('/v1/notes', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };
  /***** Never trust users - validate input *****/
  if (!newItem.title) {
    const err = new Error('Missing `title` in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
    } else {
      next();
    }
  });
});

router.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id; // returns string not number

  notes.delete(Number(id), (err, item) => {
    if (err) {
      return next(err);
    }
    if(item) {
      res.sendStatus(204);
    }
    else {
      next();
    }
  });
  //let newData = data.find(item => item.id === Number(id));
  //res.json(newData);
});

module.exports = router;

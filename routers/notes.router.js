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
  
  notes.filter(searchTerm)
    .then (list => {
      if (list) {
        res.json(list);
      } else {
        next();
      }
    }) 
    .catch(err => {
      next(err);
    });
 
});

//return a note at specified id
router.get('/api/notes/:id', (req, res, next) => {
  const {id} = req.params; // returns string not number
  
  notes.find(Number(id))
    .then (item => {
      res.json(item);
    })
    .catch (err => {
      next(err);
    });
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

  notes.update(id, updateObj)
    .then (item => {
      res.json(item);
    })
    .catch (err => {
      next(err);
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

  notes.create(newItem)
    .then(item => {
      if (item) {res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      }
      else {
        next();
      }
    })
    .catch (err => {
      next(err);
    });
});

router.delete('/api/notes/:id', (req, res, next) => {
  const id = req.params.id; // returns string not number

  notes.delete(Number(id))
    .then (item => {
      if (item) {
        res.sendStatus(204);
      } 
      else {
        next();
      }
    })
    .catch (err => {
      next(err);
    });
});

module.exports = router;

'use strict';

// TEMP: Simple In-Memory Database
const data = require('./db/notes');

console.log('hello world!');

// INSERT EXPRESS APP CODE HERE...
const express = require('express');

const app = express();

app.use(express.static('public'));

// Listen for incoming connections
app.listen(8080, function () {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});

//return array of notes
app.get('/api/notes', (req, res) => {
  const {searchTerm} = req.query;
  let newSearchTerm = data.filter(item => item.title.includes(searchTerm)); // boolean

  res.json(newSearchTerm);

});

app.get('/api/notes/:id', (req, res) => {
  const {id} = req.params;
  let newData = data.find(item => item.id === Number(id));
  res.json(newData);
});


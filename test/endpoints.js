'use strict';
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Get all', function () {

  it.only('GET request "/api/notes" should return array of notes', function () {
    return chai.request(app)
      .get('/api/notes')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.a('array');

        const expectedKeys = ['id', 'title', 'content'];
        res.body.forEach(function (element) {
          expect(element).to.be.a('object');
          expect(element).to.include.keys(expectedKeys);
        });
      });
  });
    
});

describe('Get at Id', function () {

  it.only('GET request "/api/notes/:id" should return a note at that Id', function () {
    return chai.request(app)
      .get('/api/notes/1000')
      .then(function (res) {
        expect(res).to.exist;
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.include.keys('id', 'title', 'content');
        expect(res.body.id).to.equal(1000);
        expect(res.body.title).to.equal('5 life lessons learned from cats');
        
      });
  });
  it('should respond with a 404 for an invalid id', function () {
    return chai.request(server)
      .get('/api/notes/9999')
      .catch(err => err.response)
      .then(res => {
        expect(res).to.have.status(404);
      });
  });
    
});

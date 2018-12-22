/* eslint-disable no-undef */
/*
* Test for Book Controllers
*/

process.env.NODE_ENV = 'test';
const { Router } = require('express');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const Book = require('../models/books');

const router = Router();

chai.use(chaiHttp);

describe('Books', () => {
  // Before each test we empty the database
  beforeEach((done) => {
    Book.remove({}, (err) => {
      done();
    });
  });
});

/*
* Test GET route 
*/

describe('/GET book', () => {
  it('it should GET all the books', (done) => {
    chai.request(router);
    .get('/books/all')
    .end((err, res) => {
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.lenght.should.be.eql(0);
    done();
    })
  })
});
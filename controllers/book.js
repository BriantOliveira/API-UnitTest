/*
*   Book controller
*/

const { Router } = require('express');
const { respondWith } = require('../utils/clientResponse');
const Book = require('../models/books');

const router = Router();

/*
* GET - Retrieve all the books
*/
router.get('/all', (req, res) => {
  // Query the database
  const findAllBooks = Book.find({});
  findAllBooks.exec((err, books) => {
    // Early exit if books are not found
    if (err) {
      return respondWith(res, 500, ['An error occurred while retriving all books'], { err });
    }
    return respondWith(res, 200, { books });
  });
});

/*
*  POST - Create a new book
*/
router.post('/create', (req, res) => {
  const newBook = new Book(req.body);

  // Save it in the database
  newBook.save((err, book) => {
    // Early exit if error occurs
    if (err) {
      return respondWith(res, 500, ['An error occurred while saving new book'], { err });
    }
    return respondWith(res, 201, ['Book created successfully.'], { book });
  });
});

/*
* GET - Retrieve book by id
*/
router.get('/:id', (req, res) => {
  // Find book by id
  const findBook = Book.findById(req.params.id, (err, book) => {
    // Early exist if book is not found
    if (!findBook) {
      return respondWith(res, 404, ['Could not find book requested'], { err });
    }
    return respondWith(res, 200, ['Book found successfully'], { book });
  });
});

/*
*  DELETE - Delete book by id
*/
router.delete('/:id', (req, res) => {
  Book.findByIdAndRemove(req.params.id, book => respondWith(res, 200, ['Book deleted successfully'], { book }));
});

/*
*   PUT - update book by id
*/
router.put('/:id', (req, res) => {
  Book.findById({ _id: req.params.id }, (err, book) => {
    if (err) {
      return respondWith(res, 500, { err });
    }
    Object.assign(book, req.body).save((err, book) => {
      if (err) res.send(err);
      return respondWith(res, 200, ['Book updated successfully.'], { book });
    });
  });
});


module.exports = router;

/*
*   Book controller
*/

const { Router } = require('express');
const { respondWith } = require('../utils/clientResponse');
const  Book = require('../models/books');
const router = Router();

/*
* GET - Retrieve all the books
*/
router.get('/all/books', (req, res) => {
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
  const findBook = Book.findById(req.params.id);

  // Early exist if book is not found
  if (!findBook) {
    return respondWith(res, 404, ['Could not find book requested']);
  }
  return  respondWith(res, 200, ['Book found successfully'], { findBook });
});

/*
*  DELETE - Delete book by id
*/
router.delete('/:id', (res, req) => {
  const deletedBook = Book.remove({ _id: req.params.id })

  // Early exist if an error occurs
  if (!deletedBook) {
    return respondWith(res, 500, ['An error occurred while deleting book']);
  }
  return respondWith(res, 200, ['Book deleted successfully'], { deletedBook });
});

/*
*   PUT - update book by id 
*/
router.put('/:id', (req, res) => {
  findBook = Book.findById({ _id: req.params.id })

   // Early exist if an error occurs
   if (!findBook) {
    return respondWith(res, 500, ['An error occurred while updating book']);
  }

  // Update book and save update to the database
  Object.assign(findBook, req.body).save((err, book) => {
    if (err) res.send(err);
    return respondWith(res, 200, ['Book updated successfully.'], { book }) 
  });
});


module.exports = router;
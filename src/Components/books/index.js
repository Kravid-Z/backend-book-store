import express from "express";
import { v4 as uuid } from "uuid";
import { getBooks, writeBooks } from "../books/fs-services-books.js";
import { check, validationResult } from "express-validator";

const route = express.Router();

const middlewareValidator = [
  check("title").exists().withMessage("Title is mandatory field!"),
  check("price")
    .isFloat()
    .withMessage("Price must be float Number ???? Need to fix this condition!"),
  check("category").exists().withMessage("PLease add category"),
  check("img").exists().isURL().withMessage("PLease add url img"),
];

//GET all books or filetred books by query ?
route.get("/", async (req, res, next) => {
  try {
    const books = await getBooks();

    if (req.query && req.query.title) {
      const filteredBooks = books.filter(
        (b) => b.hasOwnProperty("title") && b.title === req.query.title
      );
      res.send(filteredBooks);
    } else {
      res.send(books);
    }
  } catch (error) {
    console.log(
      "error in GET all books or filtered by query, pasing it to errorHandling",
      error
    );
    next(error);
  }
});

//GET book by ===> asin
route.get("/:asin", async (req, res, next) => {
  try {
    const books = await getBooks();
    const book = books.find((book) => book.asin === req.params.asin);
    if (book) {
      res.send(book);
    } else {
      const err = new Error();
      err.frontEndMssg = "Book not found check asin, please";
      err.statusCode = 404;
      next(err);
    }
  } catch (error) {
    console.log("error in GET by asin, pasing it to errorHandling" + error);
    next(error);
  }
});
//POST new book
route.post("/", middlewareValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error();
      err.errorList = errors;
      err.statusCode = 400;
      next("error in POST, pasing it to errorHandling", err); // passing error to errorHandling
    } else {
      const books = await getBooks();
      const newBook = {
        ...req.body,
        asin: uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }; //New Book && adding unique id for Book && ceratedDate
      books.push(newBook);
      await writeBooks(books);
      res.status(201).send({ asin: newBook.asin });
    }
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});
//PUT edit book
route.put("/:asin", middlewareValidator, async (req, res, next) => {
  try {
    const books = await getBooks();
    if (!books.some((book) => book.asin === req.params.asin)) {
      const err = new Error();
      err.errorList = { mssg: "Asin not found check again!" };
      err.statusCode = 400;
      next(err); // passing error to errorHandling
    } else {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const err = new Error();
        err.errorList = errors;
        err.statusCode = 400;
        next(err); // passing error to errorHandling
      } else {
        const { asin, createdAt } = books.find(
          (book) => book.asin === req.params.asin
        );
        const newBooksArray = books.filter(
          (book) => book.asin !== req.params.asin
        ); // filtering out the specific book object
        const bookModified = {
          ...req.body,
          asin,
          createdAt,
          updatedAt: new Date(),
        }; // saving book.id && adding field lastModified
        newBooksArray.push(bookModified);
        await writeBooks(newBooksArray);
        res.send(bookModified);
      } // if i send like this res.status(204).send(bookModified); status code always will omit the thing passed to send(string || object)
    }
  } catch (error) {
    console.log("error in PUT book, pasing it to errorHandling" + error);
    next(error);
  }
});
//DELETE book
route.delete("/:asin", async (req, res, next) => {
  // need another condition to avoid FRONTEND send asin that doesn't exist.
  try {
    const books = await getBooks();
    const newBooksArray = books.filter((book) => book.asin !== req.params.asin);
    if (books.length === newBooksArray.length) {
      const err = new Error();
      err.frontEndMssg = "This asin doesn't exist";
      err.statusCode = 404;
      next(err);
    } else {
      await writeBooks(newBooksArray);
      res.status(204).send({ mssg: "User Deleted" });
    }
  } catch (error) {
    console.log("error in DELETE book, pasing it to errorHandling" + error);
    next(error);
  }
});

export default route;

import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import booksRoutes from "./Components/books/index.js";
import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorsHandler,
} from "./Components/books/errorHandlerBooks.js";

const server = express();
const port = process.env.PORT;

const whiteList = [process.env.FE_URL_DEV, process.env.FE_URL_PROD];

const corsOption = {
  origin: (origin, next) => {
    if (whiteList.indexOf(origin) !== -1) {
      next(null, true);
    } else {
      next(new Error("Not allowed By CORS"));
    }
  },
};

server.use(cors(corsOption));
server.use(express.json());

server.use("/books", booksRoutes);
server.use(notFoundErrorHandler); // 1. First check not founds!
server.use(badRequestErrorHandler); // 2. Second check BadRequests!
server.use(forbiddenErrorHandler); // 3. Third check Forbiddens! ??????????????
server.use(catchAllErrorsHandler); // 4. Fourth check FATAL ERRORS!!!!

console.log(listEndpoints(server));

server.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    // no need to configure it manually on Heroku
    console.log("Server running on cloud on port: ", port);
  } else {
    console.log("Server running locally on port: ", port);
  }
});

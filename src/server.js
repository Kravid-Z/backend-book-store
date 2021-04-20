import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import booksRoutes from "./Components/books/index.js";

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

server.use("/books", booksRoutes);

console.log(listEndpoints(server));

server.listen(port, () => {
  if (process.env.NODE_ENV === "production") {
    // no need to configure it manually on Heroku
    console.log("Server running on cloud on port: ", port);
  } else {
    console.log("Server running locally on port: ", port);
  }
});

// ERROR 404 means NOT FOUND!
export const notFoundErrorHandler = (err, req, res, next) => {
  if (err.statusCode === 404) {
    res.status(404).send(err.frontEndMssg || "Sorry nothing here ºº! !");
  } else {
    next(err); // Remember always pass down the error to other handlers
  }
};
// ERROR 400 means BAD REQUEST!
export const badRequestErrorHandler = (err, req, res, next) => {
  if (err.statusCode === 400) {
    res.status(400).send(err.errorList); // err.errorList <= This could be the format error validator in future SchemaValidator
  } else {
    next(err);
  }
};
// ERROR 403 means FORBIDDEN!
export const forbiddenErrorHandler = (err, req, res, next) => {
  if (err.statusCode === 403) {
    res.status(403).send({ mssg: "Forbidden!" }); // This error should be throw when ueer is not authorized still not setted
  } else {
    next(err);
  }
};

// ERROR 500 means SERIOUS PROBLEMS!

export const catchAllErrorsHandler = (err, req, res, next) => {
  res.status(500).send({ mssg: "Generic Server Error!" });
  console.log("Last Handler (500)---> ", err)
};

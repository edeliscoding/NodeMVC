const fs = require("fs");
const express = require("express");
const app = express();
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

// 1) MiddleWares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//middleware- between request and response- BODYPARSER CODE
//this is body parser which makes every request in json
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Hello from the middleware!");
  next();
});

// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", createTour);
// app.get("/api/v1/tours/:id", getTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

// 3) Routes
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// 4) Start Server

module.exports = app;

const customRouter = require("./router");
const express = require("express");
const jsonServer = require("./lib/jsonServer");
var cors = require("cors");
const connectDB = require("./database");

require("dotenv").config();

const app = express();

// Prevent CORS errors
app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: [
      "http://localhost:5173", // Frontend development URL
      "https://versa-store-frontend.vercel.app", // Frontend production URL
    ],
  })
);
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

// /!\ Bind the router db to the app
app.db = jsonServer.db;

app.use(express.json());

// CustomRoute Middleware to Handle Extra Routes
app.use("/", customRouter);

app.use(jsonServer);

// Error handle Middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  res.status(500).json({
    error: err.message,
  });
});

// Not Found Middleware
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB()
    .then(() => {
      console.info(`Server running at port:${PORT}`);
      console.log("http://localhost:3000");
    })
    .catch((err) => {
      console.error(err);
      throw new Error(err);
    });
});

module.exports = app;

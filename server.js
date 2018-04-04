var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Handlebars
var exphbs = require('express-handlebars');
app.engine('handlebars', exphbs({defaultLayout: "main"}));
app.set('view engine', 'handlebars');

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";
mongoose.Promoise = Promise;

mongoose.connect(MONGODB_URI, function(err) {
  if(err) {
    console.log(err);
  } else {
    conosle.log("Working!");
  }
});

// Routes
require("./routes/api/api-routes.js")(app)

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
  mongoose.Promise = Promise;

var app = express();
  app.use(express.static("public"));
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(logger("dev"));

var Comment = require("./models/comment.js");
var Article = require("./models/article.js");
require("./routes/api-routes")(app);

app.listen(3000, function(){
  console.log("It Work!!");
});
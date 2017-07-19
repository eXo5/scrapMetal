//Dependencies;
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
  mongoose.Promise = Promise;
var handlebars = require("handlebars");
var exphbs = require("express-handlebars"); 

//express(use);
var app = express();
	//common assets directory
  app.use(express.static(process.cwd() + "/public"));
  //server activity log
  app.use(logger("dev"));
  //request readabililty
  app.use(bodyParser.urlencoded({extended: false}));

  //templating information
  app.engine("handlebars", exphbs({defaultLayout: "main"}));
  app.set("view engine", "handlebars");

//Database and configuration;
var Comment = require("./models/comment.js");
var Article = require("./models/article.js");

var databaseUri = "mongodb://localhost/scrapMetal";
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}
else {
  mongoose.connect("mongodb://localhost/scrapMetal");
}

var db = mongoose.connection;

db.on("error", function(error){
	console.log("Database error: " + error);
});

db.once("open", function(error){
if (error) {
	console.log(error);
}
	console.log('db works');
});

require("./routes/api-routes")(app);

//define PORT and listen for requests on PORT [and console.log whatever message made me laugh a little];
var PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
  console.log("Welcome to the year " + PORT);
});
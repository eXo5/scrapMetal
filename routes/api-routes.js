//dependencies
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var mongojs = require("mongojs");

//set up db
var databaseUrl = "scrap";
var collections = ["metal"];
var db = mongojs(databaseUrl, collections);
 db.on("error", function(err){
  console.log("Database Error: " + err);
 });

var hbsObj = {array: []};
module.exports = function(app){

//This route was a test.
// app.get("/", function(req, res) {
//   res.sendFile(path.resolve("./public/index1.html"));
// });

app.get("/", function(req, res) {
request("https://www.reddit.com/r/programmerhumor", function(error, response, html){
  var $ = cheerio.load(html);
  var result = [];
  $("p.title").each(function(i, element) {
    var link = $(element).children().attr("href");
    var title = $(element).children().text();

    hbsObj.array.push({
      title: title,
      link: link
    });

    // res.json(result);

  })
}) 
res.render("index", hbsObj);
});

app.post("/api/new-comment", function(req, res) {
  console.log(req);
  res.send(req.body);
})

app.get("/scrape", function(req, res){
	request("https://www.reddit.com/r/programmerhumor", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // Select each element in the HTML body from which you want information.
  // NOTE: Cheerio selectors function similarly to jQuery's selectors,
  // but be sure to visit the package's npm page to see how it works
  $("p.title").each(function(i, element) {


    var link = $(element).children().attr("href");

    var title = $(element).children().text();


    // Save these results in an object that we'll push into the results array we defined earlier
   results.push({
      title: title,
      link: link
    });

   db.links.insert({title: title,
   	link: link
   });
  });
  	res.json(results);
});
	// for (var i = 0; i > results.length; i++) {
	 //	results.
	// }
});

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

app.get("/loadScrape", function(req, res){
	db.links.find({}, function(err, data){
		if (err) {
			console.log(data)
		}
		res.json(data);
	});
});


}
//dependencies
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
//require models
var Article = require("../models/article.js");
var Comment = require("../models/comment.js");

//handlebars object;
var hbsObj = {
    array: []
};

var express = require("express");
var router = express.Router();

router.get("/", function(req, res){

})

module.exports = function(app) {

    // app.get("/", function(req, res) {

    //   db.links.find({}, function(err, found){
    //     if (err) {
    //       console.log(err)
    //     }

    //   })
    //     hbsObj.array.push({
    //       title: title,
    //       link: link
    //     });

    //     // res.json(result);

    //   });
    // });
    // res.render("index", hbsObj);
    // });

    app.get("/getcomments", function(req, res) {

    })

    app.post("/api/new-comment", function(req, res) {
        console.log(req);
        res.send(req.body);
    })

    app.get("/scrape", function(req, res) {
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
                //grab href elements from each p class=title;
                var link = $(element).children().attr("href");
                var title = $(element).children().text();


                // Save these results in an array for testing purposes
                 results.push({
                  title: title,
                  link: link
                 });   
                var article = new Article({
                  title: title,
                  link: link
                });

                console.log(article);     

                article.save(function(err, data){
                  if (err) {
                    console.log(err);
                  };

                })
            });
            //console.log(results);

           res.end();
        });
    });

    // Route 2
    // =======
    // When you visit this route, the server will
    // scrape data from the site of your choice, and save it to
    // MongoDB.
    // TIP: Think back to how you pushed website data
    // into an empty array in the last class. How do you
    // push it into a MongoDB collection instead?

    app.get("/loadScrape", function(req, res) {
        db.links.find({}, function(err, data) {
            if (err) {
                console.log(data)
            }
            res.json(data);
        });
    });


}
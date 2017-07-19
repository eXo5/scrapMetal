//dependencies
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
//require models
var Article = require("../models/article.js");
var Comment = require("../models/comment.js");

//handlebars object;
var hbsObj = {scrapeMetal: []};

var db = mongoose.connection;
module.exports = function(app) {
        //get /scrape runs cheerio scrape on specified url and pushes it to the hbsObj for index.hbs rendering. Originally this was done on app.get "/" but it didn't happen immediately and the page needed to be refreshed for everything to render.
        app.get("/scrape", function(req, res) {
        request("https://www.reddit.com/r/programmerhumor", function(error, response, html) {
            var $ = cheerio.load(html);
            // array filled to populate data.
            var results = [];
            $("p.title").each(function(i, element) {
                //grab href elements from each p class=title;
                var link = $(element).children().attr("href");
                var title = $(element).children().text();

                // Saved these results in an array for testing purposes
                 results.push({
                  title: title,
                  link: link
                 });   
                //define new articles
                var article = new Article({
                  title: title,
                  link: link
                });
                //test article
                console.log(article);     
                //"db.scrapeMetal.save()" or at least that's what I tried first.
                article.save(function(err, data){
                  if (err) {
                    console.log(err);
                  };

                })
            });//end cheerio.each()
            //console.log(results);

           res.send("Scrape Complete");

        });
    });

    app.get("/", function(req, res) {
        //get all articles and save them to the handlebars Object;
      Article.find({}, function(err, found){
        if (err) {
          console.log(err)
        }
        //console.log(found);
         hbsObj.scrapeMetal.push(found);
         console.log(hbsObj.scrapeMetal);
      })
    //render index with hbsObj;
    res.render("index", hbsObj);
    });

    //drop the database as a means to refresh.
    app.get("/dropScrap", function(req, res) {
        mongoose.connection.collections['articles'].drop( function(err) {
            if (err) {
                console.log(err);
            }
        console.log('collection dropped');
         });
        res.send("Collection Dropped");
    })

    app.get("/getcomments", function(req, res) {
        //nothing yet
    })

    app.post("/api/new-comment", function(req, res) {
        //not actually utilized yet
        console.log(req);
        res.send(req.body);
    })

    app.get("/articles/:id", function(req, res){

        Article.findOne({"_id": req.params.id})
        .populate("comment")
        .exec(function(err, doc){
            if (err) {
            console.log(err);
            res.send(err);
        }
        res.send(doc);
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

    app.get("/articles", function(req, res) {
       Article.find({}, function(err, data) {
            if (err) {
                console.log(data)
            }
            res.json(data);
        });
    });


}
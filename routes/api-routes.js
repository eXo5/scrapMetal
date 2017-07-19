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
        //So I made it half work this way with the last route get("/testhandlebars")
        //THIS USED TO get all the articles and save them to the handlebars Object and render them that way. But I followed the class example because I was originally scraping in here too, but that wouldn't render the page immediately and I thought about running a 2-3000 ms timer for res.render, but I deemed that a bit unnecessary, although I'm fairly certain it would work.;
      // Article.find({}, function(err, found){
      //   if (err) {
      //     console.log(err)
      //   }
      //   //console.log(found);
      //    //hbsObj.scrapeMetal.push(found);
      //    console.log(hbsObj.scrapeMetal);
      // })
    //render index with whats now an hbsObj with an empty array;
    res.render("index", hbsObj);
    });

    //drop the database as a means to refresh.
    app.get("/dropScrap", function(req, res) {
        mongoose.connection.collections['articles'].drop( function(err) {
            if (err) {
                console.log(err);
            }
        console.log('Collection dropped');
         });
        res.send("Collection Dropped");
    })

    app.post("/api/new-comment", function(req, res) {
        //not actually utilized yet
        console.log(req);
        res.send(req.body);
    })

    app.get("/articles/:id", function(req, res){
        console.log(req.body);
        Article.findOne({"_id": req.params.id})
        .populate("comment")
        .exec(function(err, doc){
            if (err) {
            console.log(err);
            res.send(err);
        } else {
           console.log(doc);
            //send doc to client, doc._id, doc.title, doc.comment[i]
           res.json(doc);
    }
        });
    });

    app.post("/articles/:id", function(req, res){
        console.log(req.body);
        //save new Comment as req.body
        var comment = new Comment({
            user: req.body.author,
            comment: req.body.comment
        });
        comment.save(function(err, doc){
            if (err) {
                console.log(err);
            }
            else{ 
                console.log(doc);
                //I didn't like the way it got rid of previous comments. I thought that functionality was ridiculous if we were going to make the reference in the articles schema be an array. so $push instead of what would otherwise be $set by default.
                Article.findOneAndUpdate({"_id": req.params.id}, {$push: {comment: doc}})
                .exec(function(err, doc){
                    if (err) {
                        console.log(err)
                    }
                    else {
                        res.send(doc);
                    }
                });
            }
        });
    });
    //send a json of all the links that were scraped for use by the app.get(root); 
    app.get("/articles", function(req, res) {
       Article.find({}, function(err, data) {
            if (err) {
                console.log(data)
            }
            res.json(data);
        });
    });

    app.get("/testhandlebars", function(req, res){
        //Yeah so I made it work with cheerio here and it populates everything, and I'm fairly certain I could use app.get("/", function(req, res){ cheerio request, $(p.title).each(func(i, element){ var article = new Article({title:title,link:link})res.redirect(/testhandlebars and do an Articles.find() and push everything into a hbsObj: {array: []}) })}) and it would work, but I'm ok with where I'm at right now.
        request("https://www.reddit.com/r/programmerhumor", function(error, response, html) {
            var $ = cheerio.load(html);
            // array filled to populate data.
            var results = [];
            $("p.title").each(function(i, element) {
                //grab href elements from each p class=title;
                var link = $(element).children().attr("href");
                var title = $(element).children().text();

                // Saved these results in an array for testing purposes
                 hbsObj.scrapeMetal.push({
                  title: title,
                  link: link
                 });  
            });
        
        });

        var x = function() {
            res.render("testhbs", hbsObj);
        }
        setTimeout(x, 3000);
    });

}
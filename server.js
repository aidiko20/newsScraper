var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var logger = require("morgan");

var PORT = process.env.PORT || 8000
var app = express();
var databaseUrl = "NasaScraper";
var collections = ["scrapedNews"];

app.use(express.static("public"));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var exphbs = require ("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
var db = require("./models");


// Routes

app.get("/", function (req, res) {
    db.Article.find({saved: false}, function (err, data) {
        res.render("main", {home: true, article: data});
    })
});

app.get("/saved", function (req, res) {
    db.Article.find({saved: true}, function(err, data) {
        res.render("saved", {home: false, article: data});
    })
});

app.put("api/headlines/:id", function (req, res) {
    var saved = req.body.saved == "true"
    if (saved) {
        db.Article.updateOne({_id: req.body._id}, {$set: {saved: true}}, function(err, result){
            if (err) {
                console.log(err)
            } else {
                return res.send(true)
            }
        });
    }
});

app.delete("/api/headlines/:id", function (req, res) {
    console.log("reqbody:" + JSON.stringify(req.params.id))
    db.Article.deleteOne({_id: req.params.id}, function (err, result) {
        if (err) {
            console.log(err)
        } else {
            return res.send(true)
        }
    });
});

app.get("/api/scrape", function (req, res) {
    axios.get("https://www.jpl.nasa.gov/news/").then(function (response) {
        var $ = cheerio.load(response.data);
        $(".image_and_description_container").each(function(i, element) {
            var result = {};
            result.title = $(this)
            .children(".list_text_content")
            .children(".content_title")
            .text().trim();
            result.image = $(this)
            .children(".image_and_description_container")
            .children("a")
            .attr("href");
            result.summary = $(this)
            .children(".list_text_content")
            .children(".article_teaser_body")
            .text();
            result.link = $(this)
            .chilren("a")
            .attr("href");
            
            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function (err) {
                console.log(err);
            });
        });
        res.send("Scrape Complete");
    });
});
app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
});

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
app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
});

// Routes

app.get("/", function (req, res) {
    db.Article.find({saved: false}, function (err, data) {
        res.render("home", {home: true, article: data});
    })
});

app.get("/saved", function (reeq, res) {
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
    })
})
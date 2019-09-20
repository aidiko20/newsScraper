var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

router.get("/", function (req, res) {
    db.Article.find({ "saved" : false}).sort({_id: -1}).limit(10)
    .then(function (dbArticle) {
        var hbsObject = {
            articles: dbArticle
        };
        res.render("index", hbsObject);
    })
    .catch(function (err) {
        res.json(err);
    });
})

router.get("/saved", function (req, res) {
    db.Article.find({ "saved": true}).sort({_id: -1})
    .populate("comments")
    .then(function (dbArticle) {
        var hbsObject ={
            articles: dbArticle
        };
        res.render("saved", hbsObject);
    })
    .catch(function (err) {
        res.json(err);
    });
})

router.get("/", function (req, res) {
    axios.get("https://www.jpl.nasa.gov/news/")
    .then(function (response) {
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
            .children("a")
            .attr("href");

            
            db.Article.create(req, res)
            .then(function (dbArticle) {
                console.log(dbArticle);
            })
            .catch(function (err) {
                // renderHeadlines()
                console.log(err);
            });
        });
        res.send("Scrape Complete");
    });
});
router.put("/headlines/:id", function (req, res) {
    db.Article.findOneAndUpdate({_id: req.params.id }, {
        $set: {saved: req.body.saved}
    })
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function (err) {
        res.json(err);
    });
})

router.post("/headlines/:id", function (req, res) {
    db.Note.create(req.body)
    .then(function (dbNote) {
        return dbArticle.findOneAndUpdate({_id: req.params.id}, {$push: {notes: dbNote._id} }, {new: true});
    })
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function (err) {
        res.json(err);
    });
})

router.delete("/headlines/:articleId/note/:noteId", function (req, res) {
    db.Note.deleteOne({_id: req.params.noteId })
    .then(function () {
        return db.Article.update({ _id: req.params.articleId}, {$pull: {notes: req.params.noteId} });
    })
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function (err) {
        res.json(err);
    });
})

router.delete("/scrape", function (req, res) {
    db.Article.deleteMany({})
    .then(function () {
        return db.Note.deleteMany({});
    })
    .then(function (dbArticle) {
        res.json(dbArticle);
    })
    .catch(function (err) {
        res.json(err);
    });
})
module.exports = router;
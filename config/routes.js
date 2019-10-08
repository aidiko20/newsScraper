// Server routes

// Bringing the Scrape function from scrips folder
var scrape = require("../scripts/scrape");

var scraperController = require("../controllers/scraper_controllers");
var notesController = require("../controllers/note_controllers");


module.exports = function (router) {
    // This route redners index page
    router.get("/", function (req, res) {
        res.render("index");
    });
    // This route renders saved handlebars page
    router.get("/saved", function (req, res) {
        res.render("saved")
    });

    router.get("/api/fetch", function (req, res) {
        scraperController.fetch(function(err, docs){
            if(!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new articles for now. Check back later!"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles!"
                })
            }
        });
    });
    router.get("/api/headlines", function( req, res) {
        var query = {}
        if (req.query.saved) {
            query = req.query
        }
        scraperController.get(query, function (data) {
            res.json(data);
        });
    });

    router.delete("/api/headlines/:id", function (req, res) {
        var query = {};
        query._id = req.params.id
        scraperController.delete(query, function (err, data){
            res.json(data)
        });
    });

    router.patch("/api/headlines", function (req, res) {
        scraperController.update(req.body, function (err, data){
            res.json(data);
        });
    });

    router.get("/api/notes/:headline_id?", function (req, res) {
        var query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id
        }
        notesController.get(query, function(err, data) {
            res.json(data)
        });
    });

    router.delete("/api/notes/:id", function (req, res) {
        var query = {}
        query._id = req.params.id
        notesController.delete(query, function (err, data) {
            res.json(data)
        });
    });

    router.post("/api/notes", function (rreq, res) {
        notesController.save(req.body, function (data) {
            res.json(data)
        });
    });
}
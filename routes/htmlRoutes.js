var path = require("path");

// Routes
module.exports = function(app) {

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
};

var db = require("../models");

module.exports = function(app) {
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
};
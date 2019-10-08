// scrape script

var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
    request("https://www.jpl.nasa.gov/news/", function (err, res, body) {
        var $ = cheerio.load(body);
        var articles = [];
        $(".image_and_description_container").each( function( i, element) {
            var head = $ (this).children(".list_text_content").children(".content_title").text().trim();
            var img = $(this).children(".image_and_description_container").children("a").attr("href");
            var sum = $(this).children(".list_text_content").children(".article_teaser_body").text().trim();
            var link = $(this).children("a").attr("href");

            if (head && sum ) {
                var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
                var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

                var dataToAdd = {
                    title: headNeat,
                    summary: sumNeat
                };
                articles.push(dataToAdd);
            }
        });
        cb(articles);
    });
}
module.exports = scrape;
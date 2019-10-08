module.exports = function (router) {
    // This route redners index page
    router.get("/", function (req, res) {
        res.render("index");
    });
    // This route renders saved handlebars page
    router.get("/saved", function (req, res) {
        res.render("saved")
    });
}
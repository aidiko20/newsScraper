var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var express= require("express");
var mongoose = require("mongoose");

var PORT = process.env.PORT || 8000
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
var exphbs = require ("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var routes = require("./controllers/scraper_controllers.js");
app.use(routes);
app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
});

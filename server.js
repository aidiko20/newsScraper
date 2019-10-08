var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");



var PORT = process.env.PORT || 8000
var app = express();
var router = express.Router();
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(router);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
var exphbs = require ("express-handlebars");


app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
});

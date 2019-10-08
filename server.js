var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");


var PORT = process.env.PORT || 3000
var app = express();
var router = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(_dirname + "/public"));

var exphbs = require ("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(router);

var db = process.env.MONGODB_URI || "mongodb://localhost:mongoHadlines";

mongoose.connect(db, function (error) {
    if (error) {
        console.log(error)
    }
    else {
        console.log("mongoose connection is succssful");
    }
});

app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
});

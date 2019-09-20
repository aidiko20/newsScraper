var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

// var logger = require("morgan");
var routes = require('./routes/apiRoutes');
var routes = require('./routes/htmlRoutes');

var PORT = process.env.PORT || 8000
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(routes);
var exphbs = require ("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

app.listen(PORT, function(){
    console.log("Server listening on: http://localhost:" + PORT);
});

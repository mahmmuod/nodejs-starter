const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const config = require("./config/database");
const passport = require('passport');

mongoose.connect(config.database);
let db = mongoose.connection;

//Check Connection
db.once("open", () => {
  console.log("Connected to MongoDB");
});

//Check for DB errors
db.on("error", err => {
  console.log(err);
});
//Init App
const app = express();

//Bring in module
let Article = require("./models/article");

//Load View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//express session Middleware

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);
//express messages Middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(expressValidator());
//Set Public Folder
app.use(express.static(path.join(__dirname, "public")));

//Passport Config
require('./config/passport')(passport);
//Passport MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) =>{
  res.locals.user = req.user || null;
  next();
});

//Home Route
app.get("/", (req, res) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles
      });
    }
  });
});
//Router Files
let articles = require("./routes/articles");
let users = require("./routes/users");
app.use("/articles", articles);
app.use("/users", users);

//Start server
app.listen(3000, () => {
  console.log("Server started on port 3000 ...");
});

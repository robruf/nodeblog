const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

//requiring routes
const mainRoutes = require("./routes/main");
const authRoutes = require("./routes/auth");
const postsRoutes = require("./routes/posts");
const commentsRoutes = require("./routes/comments");

//passport // session 
const session = require("express-session");
const passport = require("passport");
const localStrategy = require("passport-local");

// requiring user schema 
const User = require("./models/user");

const mongoose = require("mongoose");

const dbUrl = "mongodb://robruf:phillaak1@ds039321.mlab.com:39321/nodeblog-beta";
mongoose.connect(dbUrl);
//mongoose.connect("mongodb://localhost/nodeblog_V02"); // connecting to DB (localhost)

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public")); //serving public direcotory
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method")); 
app.use(express.static(__dirname + "/public"));

// session/passport setup

app.use(session({
    secret: "randomsecret",
    saveUninitialized: true,
    resave: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
  });

app.use("/", mainRoutes); //loading main routes
app.use("/auth", authRoutes); // loading auth routes
app.use("/posts", postsRoutes); // loading auth routes
app.use("/posts", commentsRoutes); // loading comments routes


app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("Server started");
});
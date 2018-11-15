const router = require("express").Router();

const Blog = require("../models/blog");
const blogPost = require("../models/blogpost");

const authCheck = require("../middleware/middleware")

router.get("/", (req, res) => {
    if (!req.user) {
        res.render("landing"); //render landing page
    } else {
        res.redirect("index");
    }
        
})

router.get("/index", (req, res) => {
    // console.log("User: " + req.user); ---- DEBUG
    blogPost.find({private: "N"}, (err, posts) => {
        if (err) {
            console.log(err);
        } else {
            res.render("index", {user: req.user, posts: posts});
        }
    }).sort( { _id:-1 } ); 
    
});


router.get("/blogs/:username/", authCheck.isLoggedIn, (req, res) => {
    Blog.findOne({owner: req.params.username}).populate("blogposts").exec( (err, foundBlog) => {
        if (err) {
            console.log(err);
            res.redirect("/index");
        }
        res.render("blog", {user: req.user, foundBlog: foundBlog})
    })
})

module.exports = router;
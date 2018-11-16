const router = require("express").Router();

const Blog = require("../models/blog");
const blogPost = require("../models/blogpost");

const authCheck = require("../middleware/middleware");

// CREATE ROUTE

router.get("/new", authCheck.isLoggedIn, (req, res) => {
    res.render("new");
})

router.post("/new", authCheck.isLoggedIn, (req, res) => {
    Blog.findOne({owner: req.user.username}, (err, foundBlog) => {
        if (!req.body.privatepost) { // if private post option is unchecked (public post)
            blogPost.create({author: req.user.username, title: req.body.title, content: req.body.content}, (err, newPost) => {
                if (err) {
                    console.log(err);
                } else {
                    foundBlog.blogposts.push(newPost);
                    foundBlog.save();
                    res.redirect("/blogs/" + req.user.username);
                }
            })
        } else { //if private post option is checked (private post - not visible in feeds)
            blogPost.create({author: req.user.username, title: req.body.title, content: req.body.content, private: "Y"}, (err, newPost) => {
                if (err) {
                    console.log(err);
                } else {
                    foundBlog.blogposts.push(newPost);
                    foundBlog.save();
                    res.redirect("/blogs/" + req.user.username)
                }
            })
        }
    })
})



// SHOW ROUTE

router.get("/:id", authCheck.isLoggedIn, (req, res) => {
    blogPost.findById(req.params.id).populate("comments").exec(function(err, foundPost) {
       // var a =foundPost.comments;
        //console.log(a.indexOf({"_id":"5b782609e794586e6e280f57"}))
        if (err) {
            console.log(err);
            res.redirect("/index");
        }
        res.render("show", {post: foundPost, user: req.user});
    })
})

//EDIT ROUTE
router.get("/:id/edit", authCheck.isLoggedIn, (req, res) => {
    blogPost.findById(req.params.id, (err, foundPost) => {
        if (err) {
            console.log(err);
            res.redirect("/index");
        }
        res.render("edit", {post: foundPost});
    })
})

// UPDATE ROUTE
router.put("/:id", authCheck.isLoggedIn, (req, res) => {
    if (!req.body.privatepost) {
        blogPost.findByIdAndUpdate(req.params.id, {author: req.user.username, title: req.body.title, content: req.body.content, private: "N"}, (err, updatedPost) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/posts/" + req.params.id);
            }
        })
    } else {
        blogPost.findByIdAndUpdate(req.params.id, {author: req.user.username, title: req.body.title, content: req.body.content, private: "Y"}, (err, updatedPost) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/posts/" + req.params.id);
            }
        })
    }
})

//DESTROY ROUTE
router.delete("/:id", authCheck.isLoggedIn, (req, res) => {
    blogPost.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err);
            res.redirect("/index"); // to be changed - error page to be implemented
        }
        // removing post from list of posts in Blog entry
        Blog.findOne({owner: req.user.username}, (err, foundBlog) => {
            foundBlog.blogposts.splice(foundBlog.blogposts.indexOf(req.params.id), 1);
            foundBlog.save();
        })
        res.redirect("/blogs/" + req.user.username);
    })
})

module.exports = router;
const router = require("express").Router();

const User = require("../models/user");
const Blog = require("../models/blog");

const passport = require("passport");


const authCheck = require("../middleware/middleware")

// LOGIN ROUTE
router.get("/login", authCheck.isNotLoggedIn, (eq, res) => {
    res.render("login");
})

router.post("/login", authCheck.isNotLoggedIn, passport.authenticate("local", {
    successRedirect: "/index",
    failureRedirect: "/login"
}), (req, res) => {
    
})

// SIGNUP ROUTE
router.get("/signup", authCheck.isNotLoggedIn, (req, res) => {
    res.render("signup");
})

router.post("/signup", authCheck.isNotLoggedIn, (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect("/auth/signup");
        }  
        passport.authenticate("local")(req, res, () => {
            Blog.create({owner: req.body.username}, (err, newBlog) => {
                if (err) {
                    console.log(err);
                }
            })
            res.redirect("/index");
        })
    })
})

// LOGOUT
router.get("/logout", authCheck.isLoggedIn, (req, res) => {
    req.logout();
    res.redirect("/");
})

module.exports = router;
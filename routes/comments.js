const router = require("express").Router();

const blogPost = require("../models/blogpost");
const commentPost = require("../models/comments");

const authCheck = require("../middleware/middleware");

router.post("/:id/comments", authCheck.isLoggedIn, (req, res) => {
    blogPost.findById(req.params.id, (err, foundPost) => {
        if (err) {
            console.log(err);
        } else {
            commentPost.create({author: req.user.username, comment: req.body.comment}, (err, newComment) => {
                if (err) {
                    console.log(err);
                } else {
                    foundPost.comments.push(newComment);
                    foundPost.save();
                    res.redirect("back")
                }
            })
        }
    })
})

router.put("/:id/comments/:comment_id", (req, res) => {
    commentPost.findByIdAndUpdate(req.params.comment_id, {comment: req.body.comment}, (err, updatedComment) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("back");
        }
    })
})

router.delete("/:id/comments/:comment_id", (req, res) => {
    commentPost.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            console.log(err);
        } else {

            blogPost.findById(req.params.id, (err, foundPost) => {
                // const commentsList = foundPost.comments;
                // console.log(commentsList)
                // const index = commentsList.indexOf(req.params.comment_id);
                // console.log(index)
                // console.log(foundPost.comments)
                foundPost.comments.splice(foundPost.comments.indexOf(req.params.comment_id), 1);
                foundPost.save();
                // console.log(foundPost.comments)
            })
            res.redirect("back")
        }
    })
})

module.exports = router;
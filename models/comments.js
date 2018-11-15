const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    author: String,
    comment: String
})

module.exports = mongoose.model("Comment", commentSchema);
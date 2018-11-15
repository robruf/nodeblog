const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
    owner: String,
    blogposts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blogpost"
        }
    ]
})

module.exports = mongoose.model("Blog", blogSchema);
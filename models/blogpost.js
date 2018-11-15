const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
    author: String,
    title: String,
    //thumbnail: String,
    content: String,
    created: {type: Date, default: Date.now},
    private: {type: String, default: "N"},
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Blogpost", blogPostSchema);
const mongoose = require("mongoose");

const TownReviewsSchema = new mongoose.Schema({
    districtNumber: {
        type: Number,
        required: [true, "Please add a district number"],
    },
    userName: {
        type: String,
        required: [true, "Please add the reviewer's name"],
    },
    rating: {
        type: Number,
        required: [true, "Please add a rating between 0 and 5"]
    },
    reviewText: {
        type: String,
        required: [true, "Please add text for the review"]
    }
})



module.exports = mongoose.model("TownReviews", TownReviewsSchema)

const mongoose = require("mongoose");

const TownReviewsStatsSchema = new mongoose.Schema({
    districtNumber: {
        type: Number,
        required: [true, "Please add a district number"],
    },
    totalRatings: {
        type: Number,
        required: [true, "Please add total ratings"]
    },
    totalReviews: {
        type: Number,
        required: [true, "Please add total reviews"]
    },
})

module.exports = mongoose.model("TownReviewsStats", TownReviewsStatsSchema)

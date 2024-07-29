const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseAutopopulate = require('mongoose-autopopulate');

const TownReviewsSchema = new mongoose.Schema({
    districtNumber: {
        type: Number,
        required: [true, "Please add a district number"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Please add the reviewer"],
        autopopulate: { select: 'name' }
    },
    rating: {
        type: Number,
        required: [true, "Please add a rating between 0 and 5"]
    },
    reviewText: {
        type: String,
        required: [true, "Please add text for the review"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

TownReviewsSchema.plugin(mongoosePaginate);
TownReviewsSchema.plugin(mongooseAutopopulate);

module.exports = mongoose.model("TownReviews", TownReviewsSchema)
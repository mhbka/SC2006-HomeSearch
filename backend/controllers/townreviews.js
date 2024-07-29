const { query } = require('express');
const mongoose = require ('mongoose');
const MainData = require('../models/MainData');
const TownReviews = require('../models/TownReviews');
const TownReviewsStats = require('../models/TownReviewsStats');
const User = require("../models/User");

exports.getDistrictReviews = async(req, res, next) => {
    const districtNumber = req.params.districtNumber;

    try {
        const reviewData = await TownReviews.find({districtNumber: districtNumber});
        let townStatsData = await TownReviewsStats.findOne({districtNumber: districtNumber});

        if (!townStatsData) {
            townStatsData = new TownReviewsStats({
                districtNumber,
                totalRatings: 0,
                totalReviews: 0
            });
            await townStatsData.save();
        }

        let averageRating = 0;
        if (townStatsData.totalRatings != 0 && townStatsData.totalReviews != 0) {
            averageRating = townStatsData.totalRatings / townStatsData.totalReviews;
        }

        res.json({
            averageRating: averageRating,
            data: reviewData
        });
    }
    catch (error) {
        res.status(500).send({message: "Internal error fetching district reviews"});
        console.log(error)
    }
}

exports.postDistrictReview = async(req, res, next) => {
    try {
        const districtNumber = req.params.districtNumber;
        let {rating, reviewText} = req.body;

        // Basic validation
        if (!districtNumber || !rating || !reviewText) {
            return res.status(400).json({error: "District number, rating and review text are required"});
        }
        else if (typeof rating !== 'number' || typeof reviewText !== 'string') {
            return res.status(400).json({error: "Rating must be a number and review text must be a string"});
        }
        if (rating < 0) { rating = 0; }
        else if (rating > 5) { rating = 5; }
        rating = Math.floor(rating);

        // Obtain user and post a new review to DB
        const user = await User.findById(req.user.id);
        const review = new TownReviews({
            districtNumber: districtNumber,
            userName: user.name,
            rating: rating,
            reviewText: reviewText,
        });
        review.isNew = true;
        await review.save();

        // Update the stats for this district
        let townStatsData = await TownReviewsStats.findOne({districtNumber: districtNumber});
        if (!townStatsData) {
            townStatsData = new TownReviewsStats({
                districtNumber,
                totalRatings: 0,
                totalReviews: 0
            });
            await townStatsData.save();
        }

        townStatsData.totalRatings += rating;
        townStatsData.totalReviews += 1;
        townStatsData.save();

        res.status(200).send();
    }

    catch (error) {
        res.status(500).send({message: "Internal error posting district review"});
        console.log(error)
    }
}
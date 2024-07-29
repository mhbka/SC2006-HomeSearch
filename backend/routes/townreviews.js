const express = require('express');
const router = express.Router();
const { protect } = require("../middleware/auth");
const TownReviewsController = require('../controllers/townreviews');

router.get("/:districtNumber", protect, TownReviewsController.getDistrictReviews)
router.post("/:districtNumber", protect, TownReviewsController.postDistrictReview)

module.exports = router
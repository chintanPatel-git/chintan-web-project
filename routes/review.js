const express = require("express");
const wrapAsync = require("../utils/wrapAsync.js");

const router = express.Router({ mergeParams: true });

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewcontroller = require("../controllers/reviews.js");

// //review route
console.log();
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewcontroller.newReview)
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewcontroller.deleteReview)
);

module.exports = router;

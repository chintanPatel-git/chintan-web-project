const listing = require("../models/listing.js");
const review = require("../models/Review.js");

module.exports.newReview = async (req, res) => {
  let listings = await listing.findById(req.params.id);
  let newreview = await new review(req.body.review);
  newreview.author = req.user._id;

  listings.reviews.push(newreview);

  await listings.save();
  await newreview.save();
  req.flash("success", "New Review Created!");
  res.redirect(`/listings/${listings._id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  console.log(req.listing);
  await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted!");
  res.redirect(`/listings/${id}`);
};

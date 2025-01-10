const mongoose = require("mongoose");
const Review = require("./Review");
// const { string } = require("joi");

const Schema = mongoose.Schema;

const listingschema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type:
      enum: ["Point"], // 'location.type' must be 'Po
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

listingschema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const listing = mongoose.model("listing", listingschema);
module.exports = listing;

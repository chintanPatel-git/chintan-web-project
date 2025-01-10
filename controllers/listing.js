const listing = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const alllistings = await listing.find({});
  res.render("./listings/index.ejs", { alllistings });
};

module.exports.rendernewform = (req, res) => {
  console.log(req.user);

  res.render("./listings/new.ejs");
};
module.exports.showlisting = async (req, res) => {
  let { id } = req.params;
  const listings = await listing
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");

  if (!listings) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }

  res.render("./listings/show.ejs", { listings });
};
module.exports.newlisting = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;
  await newListing.save();
  req.flash("success", "New Listing Created!");

  res.redirect("/listings");
};
module.exports.editlisting = async (req, res) => {
  let { id } = req.params;
  const listings = await listing.findById(id);
  if (!listings) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listings.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  console.log(originalImageUrl);
  res.render("./listings/edit.ejs", { listings, originalImageUrl });
};
module.exports.updatelisting = async (req, res, next) => {
  let { id } = req.params;
  console.log(req.body.listing);
  let listings = await listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listings.image = { url, filename };
    await listings.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
module.exports.destroylisting = async (req, res) => {
  let { id } = req.params;
  const deletelistings = await listing.findByIdAndDelete(id);
  console.log(deletelistings);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

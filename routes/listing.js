const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const { isLoggedIn, isowner, validatelisting } = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/").get(wrapAsync(listingcontroller.index)).post(
  isLoggedIn,

  upload.single("listing[image]"),
  validatelisting,
  wrapAsync(listingcontroller.newlisting)
);

router.get("/new", isLoggedIn, listingcontroller.rendernewform);

router
  .route("/:id")
  .get(wrapAsync(listingcontroller.showlisting))
  .put(
    isLoggedIn,
    isowner,
    upload.single("listing[image]"),
    validatelisting,
    wrapAsync(listingcontroller.updatelisting)
  )
  .delete(isLoggedIn, isowner, wrapAsync(listingcontroller.destroylisting));

// // // //edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isowner,
  wrapAsync(listingcontroller.editlisting)
);

module.exports = router;

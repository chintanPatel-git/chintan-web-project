if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpreessError = require("./utils/ExpressError.js");
const session = require("express-session");
const mongostore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
// const { error } = require("console");
const dburl = process.env.ATLAS_DB;
async function Main() {
  await mongoose.connect(dburl);
}

//previous url="mongodb://127.0.0.1:27017/kisu"

Main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.set("view eengine", "ejs");
let port = 8080;

const store = mongostore.create({
  mongoUrl: dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR IN MONGO STORE", err);
});
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  throw new ExpreessError(401, "page no found");
});

app.use((err, req, res, next) => {
  let { statuscode = 500, message } = err;
  res.status(statuscode).render("error.ejs", { err });
  // res.status(statuscode).send(message);
});

app.listen(port, () => {
  console.log("app is listening on port");
});
// // app.get("/testlisting", async (req, res) => {
//   let samplelisting = new listing({
//     title: "my new villa",
//     description: "by the beach",
//     price: 1200,
//     location: "calengute goa"
//     country: "india",
//   });
//   await samplelisting.save();

//   res.send("verwvn");
// });

// for practice

// app.listen(8080, () => {
//   console.log("app is listening on port");
// });

// app.get("/listings", (req, res) => {
//   throw new ExpreessError("404", "page notgewffsefersgeggvsvsvvyvukj found");
// });

// app.use((err, req, res, next) => {
//   let { statuscode, message } = err;
//   res.status(statuscode).send(message);
// });

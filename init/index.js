const mongoose = require("mongoose");
const listing = require("../models/listing.js");
const initData = require("./data.js");

async function Main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/kisu");
}
Main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

const initDb = async () => {
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "66f6575c6109ac86d6fa9bfc",
  }));

  await listing.insertMany(initData.data);
  console.log("data was saved");
};

initDb();

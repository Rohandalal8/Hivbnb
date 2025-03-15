const initData = require("./data.js");
const listing = require("../models/listing.js");

const initDB = async () => {
  await listing.deleteMany({});
  await listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
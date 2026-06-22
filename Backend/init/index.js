const initData = require("./data.js");
const listing = require("../models/listing.js");

const initDB = async () => {
  await listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "67d98503f79780d285fad19d",
    geometry: {
      type: "Point",
      coordinates: [obj.longitude, obj.latitude]
    }
  }));
  await listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
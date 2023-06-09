const mongoose = require("mongoose");

const DetailsModel = new mongoose.model(
  "details",
  new mongoose.Schema({
    image1: {
      type: String,
      required: false,
    },
    image2: {
      type: String,
      required: false,
    },
    check_in_time: { type: String, required: true },
    check_out_time: { type: String, required: true },
  })
);
module.exports = DetailsModel;

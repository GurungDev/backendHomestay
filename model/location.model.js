const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  locationName: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rooms: { type: Number },
});

const LocationModel = mongoose.model("location", LocationSchema);

module.exports = LocationModel;

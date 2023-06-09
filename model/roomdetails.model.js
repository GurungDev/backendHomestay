const mongoose = require("mongoose");

const RoomDetails = new mongoose.model(
  "roomDetails",
  new mongoose.Schema({
    title: { type: String, required: true },
    room: { type: String, required: true },
    description: { type: String, required: true },
    services: { type: String, required: true },
    cost: { type: String, required: true },
  })
);
module.exports = RoomDetails;

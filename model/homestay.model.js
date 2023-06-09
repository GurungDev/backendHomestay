const mongoose = require("mongoose");

const HomestaySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    requied: true,
  },

  image: {
    type: String,
    required: false,
  },
  userId: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  contact: { type: String, required: true },
  details: { type: mongoose.Schema.Types.ObjectId, ref: "details" },
  packageDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "packageDetails",
  },
  roomDetails: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roomDetails",
    },
  ],
  map: [{ type: String, required: true }],
});

const HomestayModel = mongoose.model("homestay", HomestaySchema);

module.exports = HomestayModel;

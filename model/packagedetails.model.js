const mongoose = require("mongoose");
const PackageDetails = new mongoose.model(
  "packageDetails",
  new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    cost: { type: String, required: true },
  })
);
module.exports = PackageDetails;

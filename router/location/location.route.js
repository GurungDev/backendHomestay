const express = require("express");
const LocationModel = require("../../model/location.model");
const uploadyImage = require("../../middleware/uploadImage.js");
const HomestayModel = require("../../model/homestay.model");
const auth = require("../../middleware/auth");
const router = express.Router();

// adding a location inside the database
router.post("/add", uploadyImage(), async (req, res) => {
  try {
    const { locationName, image, description } = req.body;
    const location = new LocationModel({
      locationName,
      image,
      description,
    });
    await location.save();
    res.send("Sucessfull");
  } catch (error) {
    res.send(error.message);
  }
});

// getting all the location from the database
router.get("/", async (req, res) => {
  const location = await LocationModel.find();
  let locations = [];
  for (const e of location) {
    const homestays = await HomestayModel.distinct("location").count({
      location: { $regex: e.locationName, $options: "i" },
    });
    locations.push({
      room: homestays,
      locationName: e.locationName,
      image: e.image,
      _id: e._id,
    });
  }
  res.send(locations);
});

// getting location according to id
router.get("/id", async (req, res) => {
  const { locationId } = req?.query;

  const location = await LocationModel.findOne({ _id: locationId });
  res.send(location);
});

module.exports = router;

const express = require("express");
const auth = require("../../middleware/auth");
const HomestayModel = require("../../model/homestay.model.js");
const uploadyImage = require("../../middleware/uploadImage.js");
const LocationModel = require("../../model/location.model");
const DetailsModel = require("../../model/homestaydetails.model");
const RoomDetails = require("../../model/roomdetails.model");
const PackageDetails = require("../../model/packagedetails.model");
const { default: mongoose } = require("mongoose");

const router = express.Router();

//sorting according to rating
async function rating(req, res, next) {
  const homestays = req.homestay;
  let newHomestays = [];
  let ratingProvided = false;
  const { fiveStar, fourStar, threeStar, twoStar, oneStar } = req?.query;
  if (oneStar == 1) {
    ratingProvided = 1;
  }
  if (fiveStar == 1) {
    ratingProvided = 5;
  }
  if (fourStar == 1) {
    ratingProvided = 4;
  }
  if (threeStar == 1) {
    ratingProvided = 3;
  }
  if (twoStar == 1) {
    ratingProvided = 2;
  }

  if (ratingProvided) {
    homestays.map((e) => {
      e.rating == ratingProvided ? newHomestays.push(e) : null;
    });
    req.homestay = newHomestays;
  }

  next();
}

//sorting according to location
async function location(req, res, next) {
  const homestays = req.homestay;
  let newHomestays = [];
  const { location } = req?.query;

  if (location != null) {
    homestays.map((e) => {
      e.location.toLowerCase().includes(location.toLowerCase())
        ? newHomestays.push(e)
        : null;
    });
    req.homestay = newHomestays;
  }
  next();
}

//sorting according to cost
function cost(req, res, next) {
  const homestays = req.homestay;
  let sortBy = 0;
  const { lowToHigh, hightToLow } = req?.query;
  if (lowToHigh == 1) {
    sortBy = 1;
  }
  if (hightToLow == 1) {
    sortBy = 2;
  }
  if (sortBy == 1) {
    homestays.sort((a, b) => a.packageDetails.cost - b.packageDetails.cost);
    req.homestay = homestays;
  } else if (sortBy == 2) {
    homestays.sort((a, b) => b.packageDetails.cost - a.packageDetails.cost);
    req.homestay = homestays;
  }
  next();
}

// Adding homestay in the database
router.post("/add", auth, uploadyImage(), async (req, res) => {
  try {
    const userId = req.idUser;
    const { name, description, image, location, contact, rating } = req.body;
    const blog = new HomestayModel({
      name,
      description,
      image,
      userId,
      location,
      contact,
      rating,
      details: new mongoose.Types.ObjectId("647c3e1d4577f8c7245f1688"),
      packageDetails: new mongoose.Types.ObjectId("6465c83df7874a8a646cf589"),
      roomDetails: [
        new mongoose.Types.ObjectId("6465c9b3a0523d4fb5d3ab40"),
        new mongoose.Types.ObjectId("64662d080a56582ffcd60f3b"),
      ],
    });
    await blog.save();
    res.send("Sucessfull");
  } catch (error) {
    res.send(error.message);
  }
});

// Adding homestay details in the database
router.post("/details", auth, uploadyImage(), async (req, res) => {
  try {
    const { image1, image2, check_in_time, check_out_time } = req.body;

    const details = new DetailsModel({
      image1,
      image2,
      check_in_time,
      check_out_time,
    });
    await details.save();
    res.send("Sucessfull");
  } catch (error) {
    res.send(error.message);
  }
});

// Adding homestay details in the database
router.post("/details/roomDetails", async (req, res) => {
  try {
    const { title, room, description, services, cost } = req.body;
    const details = new RoomDetails({
      title,
      room,
      description,
      services,
      cost,
    });
    await details.save();
    res.send("Sucessfull");
  } catch (error) {
    res.send(error.message);
  }
});

// Adding homestay details in the database
router.post("/details/packageDetails", async (req, res) => {
  try {
    const { title, description, cost } = req.body;
    const details = new PackageDetails({
      title,
      description,
      cost,
    });
    await details.save();
    res.send("Sucessfull");
  } catch (error) {
    res.send(error.message);
  }
});

//getting all the homestay
router.get(
  "/allHomestay",
  async (req, res, next) => {
    try {
      const homestays = await HomestayModel.find()
        .populate("details")
        .populate("packageDetails")
        .populate("roomDetails");
      req.homestay = homestays;
      next();
    } catch (error) {
      res.send(error.message);
    }
  },
  rating,
  location,
  cost,
  (req, res) => {
    res.send(req.homestay);
  }
);

//getting details of homestay
router.get("/homestaydetails", async (req, res) => {
  try {
    const { data } = req?.query;
    const homestays = await HomestayModel.find({ _id: data })
      .populate("details")
      .populate("packageDetails")
      .populate("roomDetails");
    if (!homestays) {
      throw new Error("Homestay not found");
    }

    res.status(200).send(homestays);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//getting homestay according to search
router.get(
  "/search",
  async (req, res, next) => {
    const { name } = req?.query;
    console.log(name);
    try {
      const homestays = await HomestayModel.find({
        name: { $regex: name, $options: "i" },
      })
        .populate("details")
        .populate("packageDetails")
        .populate("roomDetails");
      req.homestay = homestays;
      next();
    } catch (error) {
      res.send(error.message);
    }
  },
  rating,
  location,
  cost,
  (req, res) => {
    res.send(req.homestay);
  }
);

//getting homestay according to location
router.get("/location", async (req, res) => {
  const { locationId } = req?.query;

  try {
    const location = await LocationModel.findOne({ _id: locationId });

    const homestays = await HomestayModel.find({
      location: { $regex: location.locationName, $options: "i" },
    })
      .populate("details")
      .populate("packageDetails")
      .populate("roomDetails");
    res.send(homestays);
  } catch (error) {
    res.send(error.message);
  }
});

//getting number of rooms
router.get("/roomsNo", async (req, res) => {
  const { locationId } = req?.query;
  try {
    const location = await LocationModel.findOne({ _id: locationId });
    const homestays = await HomestayModel.find({
      location: { $regex: location.locationName, $options: "i" },
    });
    const length = { data: homestays.length };
    res.send(length);
  } catch (error) {
    res.send(error.message);
  }
});

module.exports = router;

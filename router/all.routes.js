const express = require("express");
const router = express.Router();
const homestayRoute = require("./homestay/homestay.route");
const userRoute = require("./user/user.route");
const locationRoute = require("./location/location.route");

router.use("/user", userRoute);
router.use("/homestay", homestayRoute);
router.use("/location", locationRoute);
module.exports = router;

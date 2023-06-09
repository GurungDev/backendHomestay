const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
// Configuration
cloudinary.config({
  cloud_name: "dobwefa5z",
  api_key: "399464392528469",
  api_secret: "8kZ2CK_ueNL0_pJ4oW0qWfGWY5w",
});

// Upload

const uploadImage = () => {
  function parseImage() {
    const storage = multer.memoryStorage();
    const upload = multer({ storage: storage }).fields([
      { name: "homestayImage", maxCount: 1 },
      { name: "locationImage", maxCount: 1 },
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
    ]);
    return upload;
  }

  const uploadToCloudinary = async (req, res, next) => {
    try {
      const uploadImageIntoCloudinary = (image) => {
        return new Promise((resolve, reject) => {
          let cld_upload_stream = cloudinary.uploader.upload_stream(
            {
              folder: "Homestay",
            },
            function (error, result) {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          streamifier.createReadStream(image.buffer).pipe(cld_upload_stream);
        });
      };

      if (req.files?.homestayImage && req.files.homestayImage?.length) {
        const result = await uploadImageIntoCloudinary(
          req.files.homestayImage[0]
        );

        req.body.image = result.secure_url || result.url;
      }
      if (req.files?.locationImage && req.files.locationImage?.length) {
        const result = await uploadImageIntoCloudinary(
          req.files.locationImage[0]
        );

        req.body.image = result.secure_url || result.url;
      }

      if (req.files?.image1 && req.files.image1?.length) {
        const result = await uploadImageIntoCloudinary(req.files.image1[0]);

        req.body.image1 = result.secure_url || result.url;
      }

      if (req.files?.image2 && req.files.image2?.length) {
        const result = await uploadImageIntoCloudinary(req.files.image2[0]);

        req.body.image2 = result.secure_url || result.url;
      }

      next();
    } catch (e) {
      console.log(e.message);
      return failureHandler({ res, error: "image upload failure" });
    }
  };
  return [parseImage(), uploadToCloudinary];
};

module.exports = uploadImage;

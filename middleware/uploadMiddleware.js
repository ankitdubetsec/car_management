const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");

// Configure storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cars_management", // Folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"], // Allowed file types
  },
});

const upload = multer({ storage });

module.exports = upload;

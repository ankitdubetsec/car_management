const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  createCar,
  getAllCars,
  getCar,
  deleteCar,
  updateCar,
} = require("../controllers/cars");
router.route("/").get(getAllCars).post(upload.array("images", 10), createCar);
router.route("/:id").get(getCar).delete(deleteCar).patch(updateCar);
module.exports = router;

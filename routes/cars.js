const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { canViewProject } = require("../permissions/car");
const {
  createCar,
  getAllCars,
  getCar,
  deleteCar,
  updateCar,
} = require("../controllers/cars");
router.route("/").get(getAllCars).post(upload.array("images", 10), createCar);
router.route("/:id").get(getCar).delete(deleteCar).patch(updateCar);

function authGetCar(req, res, next) {
  if (!canViewProject(req.user, req.project)) {
    res.status(401);
    return res.send("Not Allowed");
  }

  next();
}

module.exports = router;

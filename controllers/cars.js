const { StatusCodes } = require("http-status-codes");
const Car = require("../models/cars");
const { NotFoundError } = require("../errors");

const createCar = async (req, res) => {
  req.body.createdBy = req.user.id;
  req.body.images = req.files.map((file) => file.path);
  req.body.tags = JSON.parse(req.body.tags);
  const car = await Car.create(req.body);
  res.status(StatusCodes.CREATED).json({ car });
};

const getCar = async (req, res) => {
  const userId = req.user.id;
  //console.log(req.params);
  const carId = req.params.id;
  const car = await Car.findOne({ _id: carId, createdBy: userId });
  if (!car) {
    throw new NotFoundError(`job with id ${carId} could not be found`);
  }
  res.status(StatusCodes.OK).send({ car });
};

const getAllCars = async (req, res) => {
  const cars = await Car.find({ createdBy: req.user.id });
  res.status(StatusCodes.ACCEPTED).send({ cars });
};

const updateCar = async (req, res) => {
  const userId = req.user.id;
  //console.log(req.params);
  const carId = req.params.id;
  const car = await Car.findOneAndUpdate(
    { _id: carId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!car) {
    throw new NotFoundError(`job with id ${carId} could not be found`);
  }
  res.status(StatusCodes.OK).send({ car });
};

const deleteCar = async (req, res) => {
  const userId = req.user.id;
  //console.log(req.params);
  const carId = req.params.id;
  const car = await Car.findOneAndDelete({ _id: carId, createdBy: userId });
  if (!car) {
    throw new NotFoundError(`job with id ${carId} could not be found`);
  }
  res.status(StatusCodes.OK).send({ car });
};

module.exports = {
  createCar,
  getAllCars,
  getCar,
  deleteCar,
  updateCar,
};

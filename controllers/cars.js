const { StatusCodes } = require("http-status-codes");
const Car = require("../models/cars");
const { NotFoundError, UnauthenticatedError } = require("../errors");
const { ROLE } = require("../role");
// const { canViewCar } = require("../permissions/car");

const createCar = async (req, res) => {
  if (req.user.role === ROLE.VIEWER) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Viewers cannot create cars.",
    });
  }
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
  let car;
  // if (!canViewCar(req.user, userId)){
  //   throw new UnauthenticatedError('you cannot view this car')
  // }
  car = await Car.findOne({ _id: carId });
  if (!car) {
    throw new NotFoundError(`car with id ${carId} could not be found`);
  }
  res.status(StatusCodes.OK).send({ car });
};

const getAllCars = async (req, res) => {
  let cars;
  if (req.user.role == ROLE.ADMIN || req.user.role == ROLE.VIEWER) {
    cars = await Car.find({});
  } else {
    cars = await Car.find({ createdBy: req.user.id });
  }

  res.status(StatusCodes.ACCEPTED).send({ cars });
};

const updateCar = async (req, res) => {
  const userId = req.user.id;
  //console.log(req.params);
  const carId = req.params.id;
  const userRole = req.user.role;
  let car;
  if (userRole == ROLE.ADMIN) {
    car = await Car.findOneAndUpdate({ _id: carId }, req.body, {
      new: true,
      runValidators: true,
    });
  } else {
    car = await Car.findOneAndUpdate(
      { _id: carId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );
  }

  if (!car) {
    throw new NotFoundError(`job with id ${carId} could not be found`);
  }
  res.status(StatusCodes.OK).send({ car });
};

const deleteCar = async (req, res) => {
  const userId = req.user.id;
  //console.log(req.params);
  const carId = req.params.id;
  const userRole = req.user.role;
  let car;
  if (userRole == ROLE.ADMIN) {
    car = await Car.findOneAndDelete({ _id: carId });
  } else {
    car = await Car.findOneAndDelete({ _id: carId, createdBy: userId });
  }
  if (!car) {
    throw new NotFoundError(`car with id ${carId} could not be found`);
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

const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const badRequest = require("../errors/bad-request");
const authError = require("../errors/unauthenticated");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  //hashing the password
  //this can be removed and can be done using mongoose middleware
  // const salt = await bycrypt.genSalt(10);
  // const pass = await bycrypt.hash(password, salt);
  // const tempUser = { name, email, password: pass };

  const user = await User.create({ ...req.body });
  //generating token
  //this can also be taken in model
  // const token = jwt.sign({ id: user._id, name: user.name }, "ankitsecret", {
  //   expiresIn: "30d",
  // });
  const token = await user.createToken();
  //console.log(token);
  res.status(StatusCodes.CREATED).json({ name: user.name, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new badRequest("please provide valid email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new authError("No such user found");
  }
  //compare password
  const isMatching = await bycrypt.compare(password, user.password);
  if (!isMatching) {
    throw new authError("invalid credentials");
  }

  const token = await jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );

  //status(StatusCodes.OK).send({ user: { name: user.name }, token })
  res.status(StatusCodes.OK).send({ name: user.name, token });
};

module.exports = {
  register,
  login,
};

const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { canViewCar } = require("./permissions/car");
const allowedOrigins = [
  "https://inquisitive-pastelito-e3b135.netlify.app",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const Authentication = require("./middleware/authentication");
//routers
const authRouters = require("./routes/auth");
const carRouters = require("./routes/cars");
app.use(express.json());
//connect db
const connectDb = require("./database/connect");
//routes
app.use("/api/v1/auth", authRouters);
app.use("/api/v1/cars", Authentication, carRouters);

function authGetCar(req, res, next) {
  if (!canViewProject(req.user, req.project)) {
    res.status(401);
    return res.send("Not Allowed");
  }

  next();
}
const start = async () => {
  try {
    //console.log(process.env.MONGO_URI);
    await connectDb(process.env.MONGO_URI);
    app.listen(5000, () => {
      console.log("server is listening to port 5000");
    });
  } catch (error) {
    console.log(error);
  }
};

start();

const jwt = require("jsonwebtoken");
const authError = require("../errors/unauthenticated");
const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new authError("Authentication invalid");
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, name: payload.name, role: payload.role };
    next();
  } catch (error) {
    throw new authError("Authentication invalid");
  }
  //next();
};

module.exports = auth;

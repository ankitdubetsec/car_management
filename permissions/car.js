const { ROLE } = require("../role");

function canViewCar(user, createdBy) {
  return user.role === ROLE.ADMIN || createdBy === user.id;
}

module.exports = {
  canViewCar,
};

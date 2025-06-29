const controller = require("../controllers/user.controller.js");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.createUser);
  app.get("/api/users", [authJwt.verifyToken, authJwt.isAdmin], controller.getAllUsers);
  app.put("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.updateUser);
  app.put("/api/users/:id/password", [authJwt.verifyToken, authJwt.isAdmin], controller.updateUserPassword);
  app.put("/api/users/:id/lock", [authJwt.verifyToken, authJwt.isAdmin], controller.lockUser);
  app.get("/api/users/:id/credit-history", [authJwt.verifyToken, authJwt.isAdmin], controller.getUserCreditHistory);
  app.delete("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);
  app.get("/api/users/phone/:phone", [authJwt.verifyToken, authJwt.isAdmin], controller.getUserByPhone);
};

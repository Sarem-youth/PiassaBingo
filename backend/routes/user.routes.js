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
  app.get("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.getUserById);
  app.put("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.updateUser);
  app.delete("/api/users/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser);
};

const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/users", [authJwt.verifyToken], controller.getUsers);
  app.post("/api/users", [authJwt.verifyToken], controller.createUser);
  app.put("/api/users/:id", [authJwt.verifyToken], controller.updateUser);
  app.delete("/api/users/:id", [authJwt.verifyToken], controller.deleteUser);
};

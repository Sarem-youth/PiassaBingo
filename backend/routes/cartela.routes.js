const controller = require("../controllers/cartela.controller.js");
const { authJwt } = require("../middleware");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/cartelas/bulk", [authJwt.verifyToken], controller.bulkCreateCartelas);
  app.post("/api/cartelas", [authJwt.verifyToken], controller.createCartela);
  app.get("/api/cartelas", [authJwt.verifyToken], controller.getAllCartelas);
  app.get("/api/cartelas/:id", [authJwt.verifyToken], controller.getCartelaById);
  app.put("/api/cartelas/:id", [authJwt.verifyToken], controller.updateCartela);
  app.delete("/api/cartelas/:id", [authJwt.verifyToken], controller.deleteCartela);
};

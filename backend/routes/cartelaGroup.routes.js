const controller = require("../controllers/cartelaGroup.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/cartela-groups", controller.getCartelaGroups);
  app.post("/api/cartela-groups", controller.createCartelaGroup);
  app.put("/api/cartela-groups/:id", controller.updateCartelaGroup);
  app.delete("/api/cartela-groups/:id", controller.deleteCartelaGroup);
};

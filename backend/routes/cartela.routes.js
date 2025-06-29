const controller = require("../controllers/cartela.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/cartelas", controller.getCartelas);
  app.post("/api/cartelas", controller.createCartela);
  app.put("/api/cartelas/:id", controller.updateCartela);
  app.delete("/api/cartelas/:id", controller.deleteCartela);
};

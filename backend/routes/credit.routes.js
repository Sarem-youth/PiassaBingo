const controller = require("../controllers/credit.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/credits/agent", controller.sendCreditToAgent);
  app.get("/api/credits/agent", controller.getAgentCreditReport);
  app.post("/api/credits/shop", controller.sendCreditToShop);
  app.get("/api/credits/shop", controller.getShopCreditReport);
  app.get("/api/credits/received", controller.getReceivedCreditReport);
  app.post("/api/credits/recharge", controller.rechargeBalance);
};

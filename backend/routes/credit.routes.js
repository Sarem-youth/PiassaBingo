const controller = require("../controllers/credit.controller.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/credits/sent-to-agent", controller.sendCreditToAgent);
  app.get("/api/credits/sent-to-agent", controller.getAgentCreditReport);
  app.post("/api/credits/sent-to-shop", controller.sendCreditToShop);
  app.get("/api/credits/sent-to-shop", controller.getShopCreditReport);
  app.get("/api/credits/received", controller.getReceivedCreditReport);
  app.post("/api/credits/recharge", controller.rechargeBalance);

  app.post("/api/credits", controller.createCredit);
  app.get("/api/credits", controller.getAllCredits);
  app.get("/api/credits/:id", controller.getCreditById);
};

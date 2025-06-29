const controller = require("../controllers/game.controller.js");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/games", controller.createGame);
  app.get("/api/games", controller.getAllGames);
  app.get("/api/games/:id", controller.getGameById);
  app.put("/api/games/:id", controller.updateGame);
  app.delete("/api/games/:id", controller.deleteGame);
};

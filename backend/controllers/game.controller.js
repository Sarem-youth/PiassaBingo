const db = require("../models");
const Game = db.game;

exports.getGames = (req, res) => {
  Game.findAll()
    .then(games => {
      res.status(200).send(games);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.createGame = (req, res) => {
  Game.create({
    bet: req.body.bet,
    players: req.body.players,
    totalPlaced: req.body.totalPlaced,
    cut: req.body.cut,
    payout: req.body.payout,
    call: req.body.call,
    winners: req.body.winners,
    cartelaTypeId: req.body.cartelaTypeId,
    shopId: req.body.shopId
  })
    .then(game => {
      res.status(201).send({ message: "Game was created successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

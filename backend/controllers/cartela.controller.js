const db = require("../models");
const Cartela = db.cartela;

exports.getCartelas = (req, res) => {
  Cartela.findAll()
    .then(cartelas => {
      res.status(200).send(cartelas);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.createCartela = (req, res) => {
  Cartela.create({
    numbers: req.body.numbers,
    cartelaGroupId: req.body.cartelaGroupId
  })
    .then(cartela => {
      res.status(201).send({ message: "Cartela was created successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateCartela = (req, res) => {
  Cartela.update(req.body, {
    where: { id: req.params.id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Cartela was updated successfully." });
      } else {
        res.send({ message: `Cannot update Cartela with id=${req.params.id}. Maybe Cartela was not found or req.body is empty!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating Cartela with id=" + req.params.id });
    });
};

exports.deleteCartela = (req, res) => {
  Cartela.destroy({
    where: { id: req.params.id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "Cartela was deleted successfully!" });
      } else {
        res.send({ message: `Cannot delete Cartela with id=${req.params.id}. Maybe Cartela was not found!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Could not delete Cartela with id=" + req.params.id });
    });
};

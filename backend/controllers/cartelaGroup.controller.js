const db = require("../models");
const CartelaGroup = db.cartelaGroup;

exports.getCartelaGroups = (req, res) => {
  CartelaGroup.findAll()
    .then(cartelaGroups => {
      res.status(200).send(cartelaGroups);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.createCartelaGroup = (req, res) => {
  CartelaGroup.create({
    name: req.body.name,
    status: req.body.status
  })
    .then(cartelaGroup => {
      res.status(201).send({ message: "CartelaGroup was created successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateCartelaGroup = (req, res) => {
  CartelaGroup.update(req.body, {
    where: { id: req.params.id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "CartelaGroup was updated successfully." });
      } else {
        res.send({ message: `Cannot update CartelaGroup with id=${req.params.id}. Maybe CartelaGroup was not found or req.body is empty!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Error updating CartelaGroup with id=" + req.params.id });
    });
};

exports.deleteCartelaGroup = (req, res) => {
  CartelaGroup.destroy({
    where: { id: req.params.id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "CartelaGroup was deleted successfully!" });
      } else {
        res.send({ message: `Cannot delete CartelaGroup with id=${req.params.id}. Maybe CartelaGroup was not found!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Could not delete CartelaGroup with id=" + req.params.id });
    });
};

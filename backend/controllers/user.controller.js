const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

exports.getUsers = (req, res) => {
  const { role, agentId, search } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const where = {};
  if (role) {
    where.role = role;
  }
  if (agentId) {
    where.agentId = agentId;
  }
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { username: { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } }
    ];
  }

  User.findAndCountAll({ 
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']]
  })
    .then(data => {
      res.status(200).send({
        totalItems: data.count,
        items: data.rows,
        totalPages: Math.ceil(data.count / limit),
        currentPage: page
      });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.createUser = (req, res) => {
  User.create({
    username: req.body.username,
    password: bcrypt.hashSync(req.body.password, 8),
    role: req.body.role,
    balance: req.body.balance,
    commission: req.body.commission,
    phone: req.body.phone,
    status: req.body.status
  })
    .then(user => {
      res.status(201).send({ message: "User was registered successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.updateUser = (req, res) => {
  const updateData = { ...req.body };
  if (updateData.password) {
    updateData.password = bcrypt.hashSync(updateData.password, 8);
  }

  User.update(updateData, {
    where: { id: req.params.id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update User with id=${req.params.id}. Maybe User was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating User with id=" + req.params.id
      });
    });
};

exports.deleteUser = (req, res) => {
  User.destroy({
    where: { id: req.params.id }
  })
    .then(num => {
      if (num == 1) {
        res.send({ message: "User was deleted successfully!" });
      } else {
        res.send({ message: `Cannot delete User with id=${req.params.id}. Maybe User was not found!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: "Could not delete User with id=" + req.params.id });
    });
};

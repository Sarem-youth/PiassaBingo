const db = require("../models");
const Credit = db.credit;
const User = db.user;
const { Op } = require("sequelize");
const sequelize = db.sequelize;

exports.getCredits = (req, res) => {
  Credit.findAll()
    .then(credits => {
      res.status(200).send(credits);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.createCredit = (req, res) => {
  Credit.create({
    amount: req.body.amount,
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
    status: req.body.status
  })
    .then(credit => {
      res.status(201).send({ message: "Credit was created successfully!" });
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.sendCreditToAgent = async (req, res) => {
  const { amount, receiverId, senderId } = req.body;
  const t = await sequelize.transaction();
  try {
    const sender = await User.findByPk(senderId, { transaction: t });
    const receiver = await User.findByPk(receiverId, { transaction: t });

    if (!sender || !receiver) {
      await t.rollback();
      return res.status(404).send({ message: "User not found." });
    }

    if (receiver.role !== 'agent') {
        await t.rollback();
        return res.status(400).send({ message: "Receiver is not an agent." });
    }

    if (sender.balance < amount) {
      await t.rollback();
      return res.status(400).send({ message: "Insufficient balance." });
    }

    const senderNewBalance = parseFloat(sender.balance) - parseFloat(amount);
    const receiverNewBalance = parseFloat(receiver.balance) + parseFloat(amount);

    await User.update({ balance: senderNewBalance }, { where: { id: senderId }, transaction: t });
    await User.update({ balance: receiverNewBalance }, { where: { id: receiverId }, transaction: t });

    await Credit.create({
      amount,
      senderId,
      receiverId,
      status: 'completed'
    }, { transaction: t });

    await t.commit();
    res.status(200).send({ message: "Credit sent successfully." });

  } catch (err) {
    await t.rollback();
    res.status(500).send({ message: err.message });
  }
};

exports.sendCreditToShop = async (req, res) => {
  const { amount, receiverId, senderId } = req.body;
  const t = await sequelize.transaction();
  try {
    const sender = await User.findByPk(senderId, { transaction: t });
    const receiver = await User.findByPk(receiverId, { transaction: t });

    if (!sender || !receiver) {
      await t.rollback();
      return res.status(404).send({ message: "User not found." });
    }

    if (receiver.role !== 'shop') {
        await t.rollback();
        return res.status(400).send({ message: "Receiver is not a shop." });
    }

    if (sender.balance < amount) {
      await t.rollback();
      return res.status(400).send({ message: "Insufficient balance." });
    }

    const senderNewBalance = parseFloat(sender.balance) - parseFloat(amount);
    const receiverNewBalance = parseFloat(receiver.balance) + parseFloat(amount);

    await User.update({ balance: senderNewBalance }, { where: { id: senderId }, transaction: t });
    await User.update({ balance: receiverNewBalance }, { where: { id: receiverId }, transaction: t });

    await Credit.create({
      amount,
      senderId,
      receiverId,
      status: 'completed'
    }, { transaction: t });

    await t.commit();
    res.status(200).send({ message: "Credit sent successfully." });

  } catch (err) {
    await t.rollback();
    res.status(500).send({ message: err.message });
  }
};

exports.getAgentCreditReport = async (req, res) => {
  const { from, to, agents } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const whereClause = {
    '$receiver.role$': 'agent'
  };

  if (from && to) {
    whereClause.createdAt = {
      [Op.between]: [new Date(from), new Date(to)]
    };
  }

  if (agents) {
    whereClause.receiverId = {
      [Op.in]: agents.split(',')
    };
  }

  try {
    const { count, rows } = await Credit.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'balance'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'balance'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).send({
      totalItems: count,
      items: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getShopCreditReport = async (req, res) => {
  const { from, to, shops } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  const whereClause = {
    '$receiver.role$': 'shop'
  };

  if (from && to) {
    whereClause.createdAt = {
      [Op.between]: [new Date(from), new Date(to)]
    };
  }

  if (shops) {
    whereClause.receiverId = {
      [Op.in]: shops.split(',')
    };
  }

  try {
    const { count, rows } = await Credit.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name', 'balance'] },
        { model: User, as: 'receiver', attributes: ['id', 'name', 'balance'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).send({
      totalItems: count,
      items: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getReceivedCreditReport = async (req, res) => {
  const { from, to } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  // Assuming the user ID is available in req.userId from a middleware
  const receiverId = req.userId; 

  const whereClause = {
    receiverId
  };

  if (from && to) {
    whereClause.createdAt = {
      [Op.between]: [new Date(from), new Date(to)]
    };
  }

  try {
    const { count, rows } = await Credit.findAndCountAll({
      where: whereClause,
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name'] },
        { model: User, as: 'receiver', attributes: ['id', 'name'] }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).send({
      totalItems: count,
      items: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.rechargeBalance = async (req, res) => {
  const { amount, userId } = req.body; // userId is the admin's ID
  const t = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction: t });

    if (!user) {
      await t.rollback();
      return res.status(404).send({ message: "User not found." });
    }

    const newBalance = parseFloat(user.balance) + parseFloat(amount);

    await User.update({ balance: newBalance }, { where: { id: userId }, transaction: t });

    await Credit.create({
      amount,
      senderId: null, // Or a system user ID
      receiverId: userId,
      status: 'recharge'
    }, { transaction: t });

    await t.commit();
    res.status(200).send({ message: "Balance recharged successfully." });

  } catch (err) {
    await t.rollback();
    res.status(500).send({ message: err.message });
  }
};

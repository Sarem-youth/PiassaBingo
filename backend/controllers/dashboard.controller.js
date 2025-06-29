const db = require("../models");
const { Op } = require("sequelize");
const User = db.user;
const Game = db.game;
const Credit = db.credit;

exports.getDashboardData = async (req, res) => {
  const { from, to, agents, shops } = req.query;

  const whereClause = {};
  if (from && to) {
    whereClause.createdAt = {
      [Op.between]: [new Date(from), new Date(to)]
    };
  }

  const agentWhereClause = { role: 'agent' };
  if (agents) {
    agentWhereClause.id = { [Op.in]: agents.split(',') };
  }

  const shopWhereClause = { role: 'shop' };
  if (shops) {
    shopWhereClause.id = { [Op.in]: shops.split(',') };
  }


  try {
    const totalSales = await Game.sum('totalPlaced', { where: whereClause });
    const weeklySales = await Game.sum('totalPlaced', {
      where: {
        ...whereClause,
        createdAt: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });
    const monthlySales = await Game.sum('totalPlaced', {
      where: {
        ...whereClause,
        createdAt: {
          [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });
    const yearlySales = await Game.sum('totalPlaced', {
      where: {
        ...whereClause,
        createdAt: {
          [Op.gte]: new Date(new Date() - 365 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const salesByAgent = await User.findAll({
        attributes: ['id', 'username'],
        where: agentWhereClause,
        include: [{
            model: Game,
            as: 'games',
            attributes: [[db.sequelize.fn('sum', db.sequelize.col('totalPlaced')), 'totalSales']],
            where: whereClause,
            required: false
        }],
        group: ['users.id']
    });

    const salesByShop = await User.findAll({
        attributes: ['id', 'username'],
        where: shopWhereClause,
        include: [{
            model: Game,
            as: 'games',
            attributes: [[db.sequelize.fn('sum', db.sequelize.col('totalPlaced')), 'totalSales']],
            where: whereClause,
            required: false
        }],
        group: ['users.id']
    });


    res.status(200).send({
      sales: {
        today: totalSales,
        weekly: weeklySales,
        monthly: monthlySales,
        yearly: yearlySales
      },
      salesDistribution: {
          byAgent: salesByAgent,
          byShop: salesByShop
      }
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

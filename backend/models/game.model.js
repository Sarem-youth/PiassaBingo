module.exports = (sequelize, Sequelize) => {
  const Game = sequelize.define("games", {
    bet: {
      type: Sequelize.DECIMAL(10, 2)
    },
    players: {
      type: Sequelize.INTEGER
    },
    totalPlaced: {
      type: Sequelize.DECIMAL(10, 2)
    },
    cut: {
      type: Sequelize.DECIMAL(10, 2)
    },
    payout: {
      type: Sequelize.DECIMAL(10, 2)
    },
    call: {
      type: Sequelize.STRING
    },
    winners: {
      type: Sequelize.INTEGER
    },
    cartelaTypeId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'cartelaGroups',
        key: 'id'
      }
    },
    shopId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  });

  return Game;
};

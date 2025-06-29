module.exports = (sequelize, Sequelize) => {
  const Credit = sequelize.define("credits", {
    amount: {
      type: Sequelize.DECIMAL(10, 2)
    },
    senderId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiverId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    status: {
      type: Sequelize.STRING
    }
  });

  return Credit;
};

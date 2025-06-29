module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    },
    balance: {
      type: Sequelize.DECIMAL(10, 2)
    },
    commission: {
      type: Sequelize.DECIMAL(5, 2)
    },
    phone: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    },
    agentId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  });

  return User;
};

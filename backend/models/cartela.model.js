module.exports = (sequelize, Sequelize) => {
  const Cartela = sequelize.define("cartelas", {
    numbers: {
      type: Sequelize.JSON
    },
    cartelaGroupId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'cartelaGroups',
        key: 'id'
      }
    }
  });

  return Cartela;
};

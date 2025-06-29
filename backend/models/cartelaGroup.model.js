module.exports = (sequelize, Sequelize) => {
  const CartelaGroup = sequelize.define("cartelaGroups", {
    name: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.STRING
    }
  });

  return CartelaGroup;
};

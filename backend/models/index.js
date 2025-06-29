const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.game = require("../models/game.model.js")(sequelize, Sequelize);
db.credit = require("../models/credit.model.js")(sequelize, Sequelize);
db.cartela = require("../models/cartela.model.js")(sequelize, Sequelize);
db.cartelaGroup = require("../models/cartelaGroup.model.js")(sequelize, Sequelize);

db.user.hasMany(db.credit, { as: 'sentCredits', foreignKey: 'senderId' });
db.user.hasMany(db.credit, { as: 'receivedCredits', foreignKey: 'receiverId' });

db.credit.belongsTo(db.user, { as: 'sender', foreignKey: 'senderId' });
db.credit.belongsTo(db.user, { as: 'receiver', foreignKey: 'receiverId' });

db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});

module.exports = db;

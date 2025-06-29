
module.exports = {
  table: 'users',
  columns: {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: 'STRING',
    },
    username: {
      type: 'STRING',
      unique: true,
      allowNull: false,
    },
    password: {
      type: 'STRING',
      allowNull: false,
    },
    balance: {
      type: 'DECIMAL',
      defaultValue: 0,
    },
    cut: {
      type: 'FLOAT',
    },
    commission: {
      type: 'FLOAT',
    },
    phone: {
      type: 'STRING',
      unique: true,
    },
    status: {
      type: 'ENUM',
      values: ['active', 'locked'],
      defaultValue: 'active',
    },
    agentId: {
      type: 'INTEGER',
      references: {
        table: 'users',
        column: 'id',
      },
    },
  },
};

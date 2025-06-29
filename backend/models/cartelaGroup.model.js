
module.exports = {
  table: 'cartela_groups',
  columns: {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: 'STRING',
      unique: true,
      allowNull: false,
    },
    status: {
      type: 'ENUM',
      values: ['active', 'inactive'],
      defaultValue: 'active',
    },
  },
};

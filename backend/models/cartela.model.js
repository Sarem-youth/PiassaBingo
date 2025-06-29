
module.exports = {
  table: 'cartelas',
  columns: {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
    },
    cartelaNumber: {
      type: 'INTEGER',
      allowNull: false,
      unique: true,
    },
    status: {
      type: 'ENUM',
      values: ['available', 'taken', 'registered'],
      defaultValue: 'available',
    },
    cartelaGroupId: {
      type: 'INTEGER',
      references: {
        table: 'cartela_groups',
        column: 'id',
      },
    },
  },
};

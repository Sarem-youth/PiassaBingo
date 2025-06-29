
module.exports = {
  table: 'games',
  columns: {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
    },
    roundNumber: {
      type: 'INTEGER',
    },
    stake: {
      type: 'DECIMAL',
    },
    winningPattern: {
      type: 'STRING',
    },
    drawnNumbers: {
      type: 'JSON',
    },
    status: {
      type: 'ENUM',
      values: ['pending', 'active', 'finished', 'cancelled'],
      defaultValue: 'pending',
    },
    shopId: {
      type: 'INTEGER',
      references: {
        table: 'users',
        column: 'id',
      },
    },
  },
};

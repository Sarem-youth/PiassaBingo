
module.exports = {
  table: 'credits',
  columns: {
    id: {
      type: 'INTEGER',
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: 'DECIMAL',
      allowNull: false,
    },
    type: {
      type: 'ENUM',
      values: ['sent_to_agent', 'sent_to_shop', 'received', 'recharge'],
      allowNull: false,
    },
    senderId: {
      type: 'INTEGER',
      references: {
        table: 'users',
        column: 'id',
      },
    },
    receiverId: {
      type: 'INTEGER',
      references: {
        table: 'users',
        column: 'id',
      },
    },
  },
};

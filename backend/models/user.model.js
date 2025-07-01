
module.exports = {
  table: 'users',
  columns: {
    id: {
      type: 'UUID',
      primaryKey: true,
    },
    username: {
      type: 'STRING',
      unique: true,
      allowNull: false,
    },
    email: {
      type: 'STRING',
      unique: true,
      allowNull: false,
    },
    password_hash: {
      type: 'STRING',
      allowNull: true,
    },
    name: {
      type: 'STRING',
      allowNull: true,
    },
    phone: {
      type: 'STRING',
      allowNull: true,
    },
    role: {
      type: 'ENUM',
      values: ['admin', 'agent', 'shop', 'cashier'],
      defaultValue: 'cashier',
    },
    status: {
      type: 'ENUM',
      values: ['active', 'locked'],
      defaultValue: 'active',
    },
    balance: {
      type: 'DECIMAL',
      defaultValue: 0,
    },
    commission_rate: {
      type: 'DECIMAL',
      defaultValue: 0,
    },
    parent_id: {
      type: 'UUID',
      references: {
        table: 'users',
        column: 'id',
      },
      allowNull: true,
    },
    created_at: {
      type: 'DATE',
      defaultValue: Date.now,
    },
    updated_at: {
      type: 'DATE',
      defaultValue: Date.now,
    },
  },
};

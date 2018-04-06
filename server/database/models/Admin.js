// eslint-disable max-len

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    username: { type: DataTypes.STRING(80), unique: true, field: 'username' },
    password: { type: DataTypes.STRING, field: 'password' },
    disabled: { type: DataTypes.BOOLEAN, field: 'disabled', defaultValue: false },
  }, {
    tableName: 'Admins',
    timestamps: true,
  })

  return Admin
}

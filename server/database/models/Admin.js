module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    username: { type: DataTypes.STRING(80), unique: true, field: 'username' },
    password: { type: DataTypes.STRING, field: 'password' },
    disabled: { type: DataTypes.BOOLEAN, field: 'disabled', defaultValue: false },
  }, {
    tableName: 'Admins',
  })

  Admin.associate = models => {
    Admin.hasMany(models.Competition, {
      as: 'competitions',
      foreignKey: { name: 'adminId', field: 'admin_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Admin
}

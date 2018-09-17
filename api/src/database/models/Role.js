'use strict'

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: { type: DataTypes.STRING, field: 'name' },
  }, {
    tableName: 'Roles',
  })

  Role.associate = models => {
    Role.hasMany(models.Organizer, {
      as: 'role',
      foreignKey: { name: 'roleId', field: 'role_id', allowNull: false },
      onDelete: 'RESTRICT',
    })

    Role.belongsTo(models.Permission, {
      as: 'permission',
      foreignKey: { name: 'permissionId', field: 'permission_id', allowNull: false },
      onDelete: 'RESTRICT',
    })
  }

  return Role
}

'use strict'

module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    organizerCreate: { type: DataTypes.BOOLEAN, field: 'organizer_create', allowNull: false, defaultValue: false },
    gamePlay: { type: DataTypes.BOOLEAN, field: 'game_play', allowNull: false, defaultValue: false },
    competitionCreate: { type: DataTypes.BOOLEAN, field: 'competition_create', allowNull: false, defaultValue: false },
  }, {
    tableName: 'Permissions',
  })

  Permission.associate = models => {
    Permission.hasMany(models.Role, {
      as: 'role',
      foreignKey: { name: 'permissionId', field: 'permission_id', allowNull: false },
      onDelete: 'RESTRICT',
    })
  }

  return Permission
}

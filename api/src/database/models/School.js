'use strict'

module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    shortName: { type: DataTypes.STRING, allowNull: false, field: 'short_name' },
    fullName: { type: DataTypes.STRING, allowNull: false, field: 'full_name' },
    aesopId: { type: DataTypes.STRING, allowNull: false, field: 'aesop_id' },
    accessCode: { type: DataTypes.STRING, allowNull: false, field: 'access_code' },
  }, {
      tableName: 'Schools',
    })

  School.associate = models => {
    School.hasMany(models.Team, {
      as: 'teams',
      foreignKey: { name: 'schoolId', field: 'school_id' },
      onDelete: 'RESTRICT',
    })
    School.hasMany(models.Teacher, {
      as: 'teachers',
      foreignKey: { name: 'schoolId', field: 'school_id' },
      onDelete: 'RESTRICT',
    })
    School.belongsTo(models.Address, {
      as: 'address',
      foreignKey: { name: 'addressId', field: 'address_id' },
      onDelete: 'RESTRICT',
    })
  }

  return School
}

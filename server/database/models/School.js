module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    aesop: { type: DataTypes.STRING, allowNull: false, field: 'aesop' },
  }, {
    tableName: 'Schools',
  })

  return School
}

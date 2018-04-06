module.exports = (sequelize, DataTypes) => {
  const Competition = sequelize.define('Competition', {
    firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    grade: { type: DataTypes.INTEGER, allowNull: false, field: 'grade' },
  }, {
    tableName: 'Competitions',
  })

  Competition.associate = models => {
    Competition.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Competition
}

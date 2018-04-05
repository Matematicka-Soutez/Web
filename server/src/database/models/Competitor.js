module.exports = (sequelize, DataTypes) => {
  const Competitor = sequelize.define('Competitor', {
    firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    grade: { type: DataTypes.INTEGER, allowNull: false, field: 'grade' },
  }, {
    tableName: 'Competitors',
  })

  Competitor.associate = models => {
    Competitor.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Competitor
}

module.exports = (sequelize, DataTypes) => {
  const TeamPosition = sequelize.define('TeamPosition', {
    horizontal: { type: DataTypes.INTEGER, allowNull: false, field: 'horizontal' },
    vertical: { type: DataTypes.INTEGER, allowNull: false, field: 'vertical' },
    power: { type: DataTypes.INTEGER, allowNull: false, field: 'power' },
  }, {
    tableName: 'TeamPositions',
    timestamps: true,
  })

  TeamPosition.associate = models => {
    TeamPosition.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    TeamPosition.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    TeamPosition.belongsTo(models.Organizer, {
      as: 'creator',
      foreignKey: { name: 'organizerId', field: 'organizer_id' },
      onDelete: 'RESTRICT',
    })
    TeamPosition.hasOne(models.TeamPosition, {
      as: 'previousPosition',
      foreignKey: { name: 'previousPositionId', field: 'previous_position_id' },
      onDelete: 'RESTRICT',
    })
  }

  return TeamPosition
}

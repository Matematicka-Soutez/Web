module.exports = (sequelize, DataTypes) => {
  const TeamPosition = sequelize.define('TeamPosition', {
    fieldIndex: { type: DataTypes.INTEGER, allowNull: false, field: 'field_index' },
    createdAt: { type: DataTypes.DATE, field: 'createdAt', defaultValue: sequelize.fn('NOW') },
    updatedAt: { type: DataTypes.DATE, field: 'updatedAt', defaultValue: sequelize.fn('NOW') },
  }, {
    tableName: 'TeamPositions',
  })
  TeamPosition.associate = models => {
    TeamPosition.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
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

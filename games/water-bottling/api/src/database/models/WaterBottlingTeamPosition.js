'use strict'

module.exports = (sequelize, DataTypes) => {
  const WatterBottlingTeamPosition = sequelize.define('WatterBottlingTeamPosition', {
    horizontal: { type: DataTypes.INTEGER, allowNull: false, field: 'horizontal' },
    vertical: { type: DataTypes.INTEGER, allowNull: false, field: 'vertical' },
    power: { type: DataTypes.INTEGER, allowNull: false, field: 'power' },
    reverted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'reverted' },
  }, {
    tableName: 'WatterBottlingTeamPositions',
    timestamps: true,
  })

  WatterBottlingTeamPosition.associate = models => {
    WatterBottlingTeamPosition.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    WatterBottlingTeamPosition.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    WatterBottlingTeamPosition.belongsTo(models.Organizer, {
      as: 'creator',
      foreignKey: { name: 'organizerId', field: 'organizer_id' },
      onDelete: 'RESTRICT',
    })
    WatterBottlingTeamPosition.belongsTo(models.Organizer, {
      as: 'revertedBy',
      foreignKey: { name: 'revertedById', field: 'reverted_by_id' },
      onDelete: 'RESTRICT',
    })
    WatterBottlingTeamPosition.hasOne(models.WatterBottlingTeamPosition, {
      as: 'previousPosition',
      foreignKey: { name: 'previousPositionId', field: 'previous_position_id' },
      onDelete: 'RESTRICT',
    })
  }

  return WatterBottlingTeamPosition
}

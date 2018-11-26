/* eslint-disable max-len */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const GameOfTrustTeamStrategy = sequelize.define('GameOfTrustTeamStrategy', {
    strategy: { type: DataTypes.INTEGER, allowNull: false, field: 'strategy' },
    validUntilTournament: { type: DataTypes.INTEGER, allowNull: false, field: 'valid_until_tournament' },
    reverted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'reverted' },
  }, {
    tableName: 'GameOfTrustTeamStrategies',
    timestamps: true,
  })

  GameOfTrustTeamStrategy.associate = models => {
    GameOfTrustTeamStrategy.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustTeamStrategy.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustTeamStrategy.belongsTo(models.Organizer, {
      as: 'creator',
      foreignKey: { name: 'organizerId', field: 'organizer_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustTeamStrategy.belongsTo(models.Organizer, {
      as: 'revertedBy',
      foreignKey: { name: 'revertedById', field: 'reverted_by_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustTeamStrategy.hasOne(models.GameOfTrustTeamStrategy, {
      as: 'previousStrategy',
      foreignKey: { name: 'previousStrategyId', field: 'previous_strategy_id' },
      onDelete: 'RESTRICT',
    })
  }

  return GameOfTrustTeamStrategy
}

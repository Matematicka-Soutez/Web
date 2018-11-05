/* eslint-disable max-len */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const GameOfTrustGameRoundStrategy = sequelize.define('GameOfTrustGameRoundStrategy', {
    strategy: { type: DataTypes.INTEGER, allowNull: false, field: 'strategy' },
    teamCount: { type: DataTypes.INTEGER, allowNull: false, field: 'team_count' },
    profitSum: { type: DataTypes.DOUBLE, allowNull: false, field: 'profit_sum' },
    profitMin: { type: DataTypes.DOUBLE, allowNull: false, field: 'profit_min' },
    profitMax: { type: DataTypes.DOUBLE, allowNull: false, field: 'profit_max' },
    profitMedian: { type: DataTypes.DOUBLE, allowNull: false, field: 'profit_median' },
  }, {
    tableName: 'GameOfTrustGameRoundStrategies',
    timestamps: true,
  })

  GameOfTrustGameRoundStrategy.associate = models => {
    GameOfTrustGameRoundStrategy.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustGameRoundStrategy.belongsTo(models.GameOfTrustGameRound, {
      as: 'gameRound',
      foreignKey: { name: 'gameRoundId', field: 'game_round_id' },
      onDelete: 'RESTRICT',
    })
  }

  return GameOfTrustGameRoundStrategy
}

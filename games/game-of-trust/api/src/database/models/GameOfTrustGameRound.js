'use strict'

module.exports = (sequelize, DataTypes) => {
  const GameOfTrustGameRound = sequelize.define('GameOfTrustGameRound', {
    number: { type: DataTypes.INTEGER, allowNull: false, field: 'number', unique: true },
    mistakeRate: { type: DataTypes.INTEGER, allowNull: false, field: 'mistake_rate', default: 0 },
    start: { type: DataTypes.DATE, allowNull: false, field: 'start' },
    end: { type: DataTypes.DATE, allowNull: false, defaultValue: new Date(), field: 'end' },
  }, {
    tableName: 'GameOfTrustGameRounds',
    timestamps: true,
  })

  GameOfTrustGameRound.associate = models => {
    GameOfTrustGameRound.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustGameRound.hasMany(models.GameOfTrustTeamScore, {
      as: 'teamScores',
      foreignKey: { name: 'gameRoundId', field: 'game_round_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustGameRound.hasMany(models.GameOfTrustGameRoundStrategy, {
      as: 'strategies',
      foreignKey: { name: 'gameRoundId', field: 'game_round_id' },
      onDelete: 'RESTRICT',
    })
    GameOfTrustGameRound.hasOne(models.GameOfTrustGameRound, {
      as: 'previousRound',
      foreignKey: { name: 'previousRoundId', field: 'previous_round_id' },
      onDelete: 'RESTRICT',
    })
  }

  return GameOfTrustGameRound
}

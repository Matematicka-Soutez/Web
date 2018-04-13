module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    folder: { type: DataTypes.STRING, allowNull: false, field: 'folder' },
  }, {
    tableName: 'Game',
  })

  Game.associate = models => {
    Game.hasMany(models.Competition, {
      as: 'competitions',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Game
}

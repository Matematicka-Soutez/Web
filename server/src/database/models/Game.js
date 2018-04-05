module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    init: { type: DataTypes.STRING, allowNull: false, field: 'init' },
    routes: { type: DataTypes.STRING, allowNull: false, field: 'routes' },
    mainComponent: { type: DataTypes.STRING, allowNull: false, field: 'main_component' },
    inputComponent: { type: DataTypes.STRING, allowNull: false, field: 'input_component' },
  }, {
    tableName: 'Game',
  })

  return Game
}

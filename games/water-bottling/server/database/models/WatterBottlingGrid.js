module.exports = (sequelize, DataTypes) => {
  const WatterBottlingGrid = sequelize.define('WatterBottlingGrid', {
    horizontal: { type: DataTypes.INTEGER, allowNull: false, field: 'horizontal' },
    vertical: { type: DataTypes.INTEGER, allowNull: false, field: 'vertical' },
    waterFlow: { type: DataTypes.INTEGER, allowNull: false, field: 'water_flow' },
  }, {
    tableName: 'WatterBottlingGrid',
    timestamps: false,
  })

  WatterBottlingGrid.associate = models => {
    WatterBottlingGrid.belongsTo(models.Competition, {
      as: 'competition',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
  }

  return WatterBottlingGrid
}

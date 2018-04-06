// eslint-disable max-len

module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    abbr: { type: DataTypes.STRING, allowNull: false, field: 'abbr' },
    allowed: { type: DataTypes.BOOLEAN, allowNull: false, field: 'allowed' },
  }, {
    tableName: 'Teams',
  })

  Team.associate = models => {
    Team.hasMany(models.Competitor, {
      as: 'competitors',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
    Team.belongsTo(models.Teacher, {
      as: 'teacher',
      foreignKey: { name: 'teacherId', field: 'teacher_id' },
      onDelete: 'RESTRICT',
    })
    Team.belongsTo(models.School, {
      as: 'school',
      foreignKey: { name: 'schoolId', field: 'school_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Team
}

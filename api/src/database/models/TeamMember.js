'use strict'

module.exports = (sequelize, DataTypes) => {
  const TeamMember = sequelize.define('TeamMember', {
    firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    grade: { type: DataTypes.INTEGER, allowNull: false, field: 'grade' },
  }, {
    tableName: 'TeamMembers',
  })

  TeamMember.associate = models => {
    TeamMember.belongsTo(models.Team, {
      as: 'team',
      foreignKey: { name: 'teamId', field: 'team_id' },
      onDelete: 'RESTRICT',
    })
  }

  return TeamMember
}

/* eslint-disable max-len */
'use strict'

module.exports = (sequelize, DataTypes) => {
  const Organizer = sequelize.define('Organizer', {
    /* COMMON PROPERTIES */
    email: { type: DataTypes.STRING, allowNull: false, field: 'email' },
    firstName: { type: DataTypes.STRING, allowNull: true, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: true, field: 'last_name' },
    password: { type: DataTypes.STRING, allowNull: true, field: 'password' },
    problemScanningToken: { type: DataTypes.STRING, allowNull: true, unique: true, field: 'problem_scanning_token' },
    /* ADMINISTRATIVE PROPERTIES */
    disabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'disabled' },
    publicToken: { type: DataTypes.STRING, field: 'public_token' },
    passwordPublicToken: { type: DataTypes.STRING, field: 'password_public_token' },
    duplicateResetPasswordToken: { type: DataTypes.STRING, field: 'duplicate_reset_password_token' },
    confirmed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'confirmed' },
    passwordLastUpdatedAt: { type: DataTypes.DATE, defaultValue: new Date(), field: 'password_last_updated_at' },
    lastLoginAt: { type: DataTypes.DATE, field: 'last_login_at' },
  }, {
    tableName: 'Organizers',
    timestamps: true,
  })

  Organizer.associate = models => {
    Organizer.belongsToMany(models.Competition, {
      as: 'competitions',
      through: 'CompetitionOrganizers',
      foreignKey: { name: 'organizerId', field: 'organizer_id' },
      onDelete: 'RESTRICT',
    })
    Organizer.belongsTo(models.Role, {
      as: 'role',
      foreignKey: { name: 'roleId', field: 'role_id', allowNull: false },
      onDelete: 'RESTRICT',
    })
    Organizer.hasMany(models.TeamSolutionChange, {
      as: 'createdTeamSolutionChanges',
      foreignKey: { name: 'createdBy', field: 'created_by' },
      onDelete: 'RESTRICT',
    })
    // Organizer.hasMany(models.Competition, {
    //   as: 'createdCompetitions',
    //   foreignKey: { name: 'organizerId', field: 'organizer_id' },
    //   onDelete: 'RESTRICT',
    // })
  }

  return Organizer
}

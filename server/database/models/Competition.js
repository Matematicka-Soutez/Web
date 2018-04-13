module.exports = (sequelize, DataTypes) => {
  const Competition = sequelize.define('Competition', {
    name: { type: DataTypes.STRING, allowNull: false, field: 'name' },
    date: { type: DataTypes.DATE, allowNull: false, field: 'date' },
    registrationRound1: { type: DataTypes.DATE, allowNull: false, field: 'registration_round1' },
    registrationRound2: { type: DataTypes.DATE, allowNull: false, field: 'registration_round2' },
    registrationRound3: { type: DataTypes.DATE, allowNull: false, field: 'registration_round3' },
    registrationEnd: { type: DataTypes.DATE, allowNull: false, field: 'registration_end' },
    isPublic: { type: DataTypes.BOOLEAN, allowNull: false, dafaultValue: false, field: 'is_public' },
    invitationEmailSent: { type: DataTypes.BOOLEAN, allowNull: false, dafaultValue: false, field: 'invitation_email_sent' },
  }, {
    tableName: 'Competitions',
  })

  Competition.associate = models => {
    Competition.belongsToMany(models.Venue, {
      as: 'venues',
      through: 'CompetitionVenues',
      foreignKey: { name: 'competitionId', field: 'competition_id' },
      onDelete: 'RESTRICT',
    })
    Competition.belongsTo(models.Game, {
      as: 'game',
      foreignKey: { name: 'gameId', field: 'game_id' },
      onDelete: 'RESTRICT',
    })
    Competition.belongsTo(models.Admin, {
      as: 'createdBy',
      foreignKey: { name: 'adminId', field: 'admin_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Competition
}

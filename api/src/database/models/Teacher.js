'use strict'

module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    /* COMMON PROPERTIES */
    title: { type: DataTypes.STRING, allowNull: true, field: 'title' },
    firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    email: { type: DataTypes.STRING, allowNull: false, field: 'email' },
    phone: { type: DataTypes.STRING, allowNull: true, field: 'phone' },
    password: { type: DataTypes.STRING, allowNull: false, field: 'password' },
    allowNotifications: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: 'allow_notifications' },
    /* ADMINISTRATIVE PROPERTIES */
    publicToken: { type: DataTypes.STRING, field: 'public_token' },
    passwordPublicToken: { type: DataTypes.STRING, field: 'password_public_token' },
    duplicateResetPasswordToken: { type: DataTypes.STRING, field: 'duplicate_reset_password_token' },
    confirmed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'confirmed' },
    passwordLastUpdatedAt: { type: DataTypes.DATE, defaultValue: new Date(), field: 'password_last_updated_at' },
    lastLoginAt: { type: DataTypes.DATE, field: 'last_login_at' },
  }, {
    tableName: 'Teachers',
    timestamps: true,
  })

  Teacher.associate = models => {
    Teacher.hasMany(models.Team, {
      as: 'teacher',
      foreignKey: { name: 'teacherId', field: 'teacher_id' },
      onDelete: 'RESTRICT',
    })
    Teacher.belongsTo(models.School, {
      as: 'school',
      foreignKey: { name: 'schoolId', field: 'school_id' },
      onDelete: 'RESTRICT',
    })
  }

  return Teacher
}

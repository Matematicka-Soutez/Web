module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    email: { type: DataTypes.STRING, allowNull: false, field: 'email' },
    phone: { type: DataTypes.STRING, allowNull: false, field: 'phone' },
    password: { type: DataTypes.STRING, allowNull: false, field: 'password' },
    allowNotifications: { type: DataTypes.BOOLEAN, allowNull: false, dafaultValue: true, field: 'allow_notifications' },
  }, {
    tableName: 'Teachers',
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

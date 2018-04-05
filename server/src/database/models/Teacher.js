module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
    lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
    email: { type: DataTypes.STRING, allowNull: false, field: 'email' },
    phone: { type: DataTypes.STRING, allowNull: false, field: 'phone' },
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

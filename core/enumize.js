'use strict'

const _ = require('lodash')

/**
 * HOW TO USE
 *
 * enums.ROLES.ids[roleId].name
 *
 * enums.ROLES.ADMIN.name
 * enums.ROLES.ADMIN.id
 *
 * for (const key in enum.ROLES) {
 *     console.log(enum.ROLES[key]);
 * } OR USE LODASH
 *
 * @param {Object} enumDefinition Enum definition
 * @returns {*}
 */
function enumize(enumDefinition) {
  const byId = {}
  const idsAsEnum = []
  for (const key in enumDefinition) {
    if (enumDefinition.hasOwnProperty(key)) {
      const temp = _.assign({}, enumDefinition[key])
      delete temp.id
      temp.key = key
      idsAsEnum.push(enumDefinition[key].id)
      byId[enumDefinition[key].id] = temp
    }
  }
  enumDefinition.ids = byId
  enumDefinition.idsAsEnum = idsAsEnum
  return enumDefinition
}

module.exports = enumize

const _ = require('lodash')
/**
 * HOW TO USE
 *
 * enums.WEEKLY_EXCERCISE.ids[weeklyExcerciseId].name
 *
 * enums.WEEKLY_EXCERCISE.ONCE.name
 * enums.WEEKLY_EXCERCISE.ONCE.id
 *
 * for (var key in enum.WEEKLY_EXCERCISE) {
 *     console.log(enum.WEEKLY_EXCERCISE[key]);
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

exports.GENDER = enumize({
  MALE: { id: 1, name: 'Male' },
  FEMALE: { id: 2, name: 'Female' },
  OTHER: { id: 3, name: 'Other' },
})

exports.WEEKLY_EXCERCISE_FREQUENCY = enumize({
  NONE: { id: 1, name: 'No excercise' },
  LITTLE: { id: 2, name: 'Once or twice a week' },
  MEDIUM: { id: 3, name: 'Three to five times a week' },
  HIGH: { id: 4, name: '5+ days each week' },
})

exports.RECORD_IMPORTANCE_TYPE = enumize({
  PRIMARY: { id: 1, name: 'Displayed records' },
  SECONDARY: { id: 2, name: 'Supported records' },
  TERTIARY: { id: 3, name: 'User added records' },
})

exports.STATES = enumize({
  ALABAMA: { id: 1, name: 'Alabama', abbr: 'AL', allowed: true },
  ALASKA: { id: 2, name: 'Alaska', abbr: 'AK', allowed: true },
  ARIZONA: { id: 3, name: 'Arizona', abbr: 'AZ', allowed: true },
  ARKANSAS: { id: 4, name: 'Arkansas', abbr: 'AR', allowed: true },
  CALIFORNIA: { id: 5, name: 'California', abbr: 'CA', allowed: true },
  COLORADO: { id: 6, name: 'Colorado', abbr: 'CO', allowed: true },
  CONNECTICUT: { id: 7, name: 'Connecticut', abbr: 'CT', allowed: true },
  DELAWARE: { id: 8, name: 'Delaware', abbr: 'DE', allowed: true },
  FLORIDA: { id: 9, name: 'Florida', abbr: 'FL', allowed: true },
  GEORGIA: { id: 10, name: 'Georgia', abbr: 'GA', allowed: true },
  HAWAII: { id: 11, name: 'Hawaii', abbr: 'HI', allowed: false },
  IDAHO: { id: 12, name: 'Idaho', abbr: 'ID', allowed: true },
  ILLINOIS: { id: 13, name: 'Illinois', abbr: 'IL', allowed: true },
  INDIANA: { id: 14, name: 'Indiana', abbr: 'IN', allowed: true },
  IOWA: { id: 15, name: 'Iowa', abbr: 'IA', allowed: true },
  KANSAS: { id: 16, name: 'Kansas', abbr: 'KS', allowed: true },
  KENTUCKY: { id: 17, name: 'Kentucky', abbr: 'KY', allowed: true },
  LOUISIANA: { id: 18, name: 'Louisiana', abbr: 'LA', allowed: true },
  MAINE: { id: 19, name: 'Maine', abbr: 'ME', allowed: true },
  MARYLAND: { id: 20, name: 'Maryland', abbr: 'MD', allowed: true },
  MASSACHUSETTS: { id: 21, name: 'Massachusetts', abbr: 'MA', allowed: true },
  MICHIGAN: { id: 22, name: 'Michigan', abbr: 'MI', allowed: true },
  MINNESOTA: { id: 23, name: 'Minnesota', abbr: 'MN', allowed: true },
  MISSISSIPPI: { id: 24, name: 'Mississippi', abbr: 'MS', allowed: true },
  MISSOURI: { id: 25, name: 'Missouri', abbr: 'MO', allowed: true },
  MONTANA: { id: 26, name: 'Montana', abbr: 'MT', allowed: true },
  NEBRASKA: { id: 27, name: 'Nebraska', abbr: 'NE', allowed: true },
  NEVADA: { id: 28, name: 'Nevada', abbr: 'NV', allowed: true },
  NEW_HAMPSHIRE: { id: 29, name: 'New Hampshire', abbr: 'NH', allowed: true },
  NEW_JERSEY: { id: 30, name: 'New Jersey', abbr: 'NJ', allowed: true },
  NEW_MEXICO: { id: 31, name: 'New Mexico', abbr: 'NM', allowed: true },
  NEW_YORK: { id: 32, name: 'New York', abbr: 'NY', allowed: true },
  NORTH_CAROLINA: { id: 33, name: 'North Carolina', abbr: 'NC', allowed: true },
  NORTH_DAKOTA: { id: 34, name: 'North Dakota', abbr: 'ND', allowed: true },
  OHIO: { id: 35, name: 'Ohio', abbr: 'OH', allowed: true },
  OKLAHOMA: { id: 36, name: 'Oklahoma', abbr: 'OK', allowed: true },
  OREGON: { id: 37, name: 'Oregon', abbr: 'OR', allowed: true },
  PENNSYLVANIA: { id: 38, name: 'Pennsylvania', abbr: 'PA', allowed: true },
  RHODE_ISLAND: { id: 39, name: 'Rhode Island', abbr: 'RI', allowed: true },
  SOUTH_CAROLINA: { id: 40, name: 'South Carolina', abbr: 'SC', allowed: true },
  SOUTH_DAKOTA: { id: 41, name: 'South Dakota', abbr: 'SD', allowed: true },
  TENNESSEE: { id: 42, name: 'Tennessee', abbr: 'TN', allowed: true },
  TEXAS: { id: 43, name: 'Texas', abbr: 'TX', allowed: true },
  UTAH: { id: 44, name: 'Utah', abbr: 'UT', allowed: true },
  VERMONT: { id: 45, name: 'Vermont', abbr: 'VT', allowed: true },
  VIRGINIA: { id: 46, name: 'Virginia', abbr: 'VA', allowed: true },
  WASHINGTON: { id: 47, name: 'Washington', abbr: 'WA', allowed: true },
  WASHINGTON_DC: { id: 51, name: 'Washington DC', abbr: 'DC', allowed: true },
  WEST_VIRGINIA: { id: 48, name: 'West Virginia', abbr: 'WV', allowed: true },
  WISCONSIN: { id: 49, name: 'Wisconsin', abbr: 'WI', allowed: true },
  WYOMING: { id: 50, name: 'Wyoming', abbr: 'WY', allowed: true },
})

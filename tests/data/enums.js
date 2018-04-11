const db = require('../../server/database')
const enums = require('../../common/enums')

module.exports = initEnums

async function initEnums() {
  await db.Gender.bulkCreate([
    enums.GENDER.MALE,
    enums.GENDER.FEMALE,
    enums.GENDER.OTHER,
  ])
  await db.WeeklyExcerciseFrequency.bulkCreate([
    enums.WEEKLY_EXCERCISE_FREQUENCY.NONE,
    enums.WEEKLY_EXCERCISE_FREQUENCY.LITTLE,
    enums.WEEKLY_EXCERCISE_FREQUENCY.MEDIUM,
    enums.WEEKLY_EXCERCISE_FREQUENCY.HIGH,
  ])
  await db.RecordImportanceType.bulkCreate([
    enums.RECORD_IMPORTANCE_TYPE.PRIMARY,
    enums.RECORD_IMPORTANCE_TYPE.SECONDARY,
    enums.RECORD_IMPORTANCE_TYPE.TERTIARY,
  ])
  await db.State.bulkCreate([
    enums.STATES.ALABAMA,
    enums.STATES.ALASKA,
    enums.STATES.ARIZONA,
    enums.STATES.ARKANSAS,
    enums.STATES.CALIFORNIA,
    enums.STATES.COLORADO,
    enums.STATES.CONNECTICUT,
    enums.STATES.DELAWARE,
    enums.STATES.FLORIDA,
    enums.STATES.GEORGIA,
    enums.STATES.HAWAII,
    enums.STATES.IDAHO,
    enums.STATES.ILLINOIS,
    enums.STATES.INDIANA,
    enums.STATES.IOWA,
    enums.STATES.KANSAS,
    enums.STATES.KENTUCKY,
    enums.STATES.LOUISIANA,
    enums.STATES.MAINE,
    enums.STATES.MARYLAND,
    enums.STATES.MASSACHUSETTS,
    enums.STATES.MICHIGAN,
    enums.STATES.MINNESOTA,
    enums.STATES.MISSISSIPPI,
    enums.STATES.MISSOURI,
    enums.STATES.MONTANA,
    enums.STATES.NEBRASKA,
    enums.STATES.NEVADA,
    enums.STATES.NEW_HAMPSHIRE,
    enums.STATES.NEW_JERSEY,
    enums.STATES.NEW_MEXICO,
    enums.STATES.NEW_YORK,
    enums.STATES.NORTH_CAROLINA,
    enums.STATES.NORTH_DAKOTA,
    enums.STATES.OHIO,
    enums.STATES.OKLAHOMA,
    enums.STATES.OREGON,
    enums.STATES.PENNSYLVANIA,
    enums.STATES.RHODE_ISLAND,
    enums.STATES.SOUTH_CAROLINA,
    enums.STATES.SOUTH_DAKOTA,
    enums.STATES.TENNESSEE,
    enums.STATES.TEXAS,
    enums.STATES.UTAH,
    enums.STATES.VERMONT,
    enums.STATES.VIRGINIA,
    enums.STATES.WASHINGTON,
    enums.STATES.WASHINGTON_DC,
    enums.STATES.WEST_VIRGINIA,
    enums.STATES.WISCONSIN,
    enums.STATES.WYOMING,
  ])
}

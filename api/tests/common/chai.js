'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const shallowDeepEqual = require('chai-shallow-deep-equal')

chai.use(dirtyChai)
chai.use(chaiAsPromised)
chai.use(shallowDeepEqual)

module.exports = chai

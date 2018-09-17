/* eslint-disable max-len */
'use strict'

require('chai').should()
const validators = require('../../../src/utils/validators')
const appErrors = require('../../../../core/errors/application')
const validationUtils = require('../../../../core/validation')

describe('Common FE/BE Validation', () => {
  describe('User name validation', () => {
    describe('numberInString', () => {
      it('should return validate false when number is in name field', () => {
        const expectedResp = { valid: false, message: 'Must not contain numbers' }
        validationUtils.numberInString('Joseph1').should.be.deep.equal(expectedResp)
        validationUtils.numberInString('1ee').should.be.deep.equal(expectedResp)
        validationUtils.numberInString('Mi1e').should.be.deep.equal(expectedResp)
      })
      it('should return validate true when no number is in name field', () => {
        const expectedResp = { valid: true }
        validationUtils.numberInString('Josephine').should.be.deep.equal(expectedResp)
        validationUtils.numberInString('snEk').should.be.deep.equal(expectedResp)
        validationUtils.numberInString('Mike').should.be.deep.equal(expectedResp)
        validationUtils.numberInString('scooter').should.be.deep.equal(expectedResp)
      })
    })

    describe('allLowercase', () => {
      it('should return validate false when name field is all lowercase', () => {
        const expectedResp = { valid: false, message: 'Must not be all lowercase' }
        validationUtils.allLowercase('john doe').should.be.deep.equal(expectedResp)
        validationUtils.allLowercase('van de camp').should.be.deep.equal(expectedResp)
        validationUtils.allLowercase('alice calmy-rey').should.be.deep.equal(expectedResp)
        validationUtils.allLowercase('j').should.be.deep.equal(expectedResp)
      })
      it('should return validate true when name field does contain at least one symbol which isn\'t lowercase', () => {
        const expectedResp = { valid: true }
        validationUtils.allLowercase('Josephine').should.be.deep.equal(expectedResp)
        validationUtils.allLowercase('snEk').should.be.deep.equal(expectedResp)
        validationUtils.allLowercase('Mike').should.be.deep.equal(expectedResp)
        validationUtils.allLowercase('MICKEY').should.be.deep.equal(expectedResp)
      })
    })

    describe('allUppercase', () => {
      it('should return validate false when name field is all uppercase', () => {
        const expectedResp = { valid: false, message: 'Must not be all uppercase' }
        validationUtils.allUppercase('JOHN DOE').should.be.deep.equal(expectedResp)
        validationUtils.allUppercase('JOHN').should.be.deep.equal(expectedResp)
        validationUtils.allUppercase('ALICE CALMY-REY').should.be.deep.equal(expectedResp)
        validationUtils.allUppercase('D').should.be.deep.equal(expectedResp)
      })
      it('should return validate true when name field does contain at least one symbol which isn\'t uppercase', () => {
        const expectedResp = { valid: true }
        validationUtils.allUppercase('Josephine').should.be.deep.equal(expectedResp)
        validationUtils.allUppercase('snEk').should.be.deep.equal(expectedResp)
        validationUtils.allUppercase('Mike').should.be.deep.equal(expectedResp)
      })
    })

    describe('containsSpecialCharacter', () => {
      it('should return validate false when name field contains special characters', () => {
        const expectedResp = { valid: false, message: 'Must not contain character: $' }
        validationUtils.containsSpecialCharacter('K$SHA').should.be.deep.equal(expectedResp)
        expectedResp.message = 'Must not contain character: !'
        validationUtils.containsSpecialCharacter('My! Name').should.be.deep.equal(expectedResp)
        expectedResp.message = 'Must not contain characters: {, !, @, #, $, %, ^, &, *, (, )'
        validationUtils.containsSpecialCharacter('{!@#$%^&*()').should.be.deep.equal(expectedResp)
        expectedResp.message = 'Must not contain characters: ), ;'
        validationUtils.containsSpecialCharacter('Robert\'); DROP TABLE Students;--').should.be.deep.equal(expectedResp)
        expectedResp.message = 'Must not contain character: ;'
        validationUtils.containsSpecialCharacter(';;;;;;;;;;').should.be.deep.equal(expectedResp)
      })
      it('should return validate true when name field does not contain special characters', () => {
        const expectedResp = { valid: true }
        validationUtils.containsSpecialCharacter('Josephine J. Doe').should.be.deep.equal(expectedResp)
        validationUtils.containsSpecialCharacter('Micheline Calmy-Rey').should.be.deep.equal(expectedResp)
        validationUtils.containsSpecialCharacter('Lauren-May Doe').should.be.deep.equal(expectedResp)
        validationUtils.containsSpecialCharacter('McDonald\'s').should.be.deep.equal(expectedResp)
        validationUtils.containsSpecialCharacter('Van de Camp').should.be.deep.equal(expectedResp)
        validationUtils.containsSpecialCharacter('J.Z.').should.be.deep.equal(expectedResp)
      })
    })
  })

  describe('isLatinString', () => {
    it('returns true when using latin characters', () => {
      let i
      for (i = 0; i <= 255; i++) {
        validationUtils.isLatinString(String.fromCharCode(i)).valid.should.be.equal(true)
      }
    })

    it('returns true when using latin characters', () => {
      validationUtils.isLatinString('aaýá־בֵּית עִבְרִי').valid.should.be.equal(false)
      validationUtils.isLatinString('aSSDDSdděščřžýáíé').valid.should.be.equal(true)
      validationUtils.isLatinString('י').valid.should.be.equal(false)
      validationUtils.isLatinString('י3').valid.should.be.equal(false)
      validationUtils.isLatinString('asdasdי3').valid.should.be.equal(false)
      validationUtils.isLatinString('יdd3ddd').valid.should.be.equal(false)
      validationUtils.isLatinString('asdas').valid.should.be.equal(true)
    })

    it('returns true when passing phone numbers', () => {
      validationUtils.isLatinString('202-555-0199').valid.should.be.equal(true)
      validationUtils.isLatinString('+1-202-555-0183').valid.should.be.equal(true)
      validationUtils.isLatinString('+44 1632 960114').valid.should.be.equal(true)
      validationUtils.isLatinString('(239)597-9103').valid.should.be.equal(true)
    })

    it('returns true when passing ZIP codes', () => {
      validationUtils.isLatinString('46342').valid.should.be.equal(true)
      validationUtils.isLatinString('C1420').valid.should.be.equal(true)
      validationUtils.isLatinString('460 14').valid.should.be.equal(true)
      validationUtils.isLatinString('Q8300').valid.should.be.equal(true)
    })

    it('returns true when passing emails', () => {
      validationUtils.isLatinString('cilarretem-3145@yopmail.com').valid.should.be.equal(true)
      validationUtils.isLatinString('jiri.erhart@strv.com').valid.should.be.equal(true)
      validationUtils.isLatinString('jiri.erhart+23@strv.com').valid.should.be.equal(true)
      validationUtils.isLatinString('you@there.com').valid.should.be.equal(true)
    })

    it('returns true when passing URLs', () => {
      validationUtils.isLatinString('https://s3.amazonaws.com/maso/public/problems.pdf').valid.should.be.equal(true)
      validationUtils.isLatinString('https://s3.amazonaws.com/maso/public/images/bottle.png').valid.should.be.equal(true)
      validationUtils.isLatinString('https://s3.amazonaws.com/maso/public/images/logo.jpg').valid.should.be.equal(true)
      validationUtils.isLatinString('https://maso.mff.cuni.cz/games?this=ok&that=too%023').valid.should.be.equal(true)
    })
  })

  describe('latinString json schema format', () => {
    before(function() {
      this.schema = {
        type: 'Object',
        required: true,
        additionalProperties: false,
        properties: {
          value: { type: 'string', required: true, format: 'latinString' },
        },
      }
    })

    it('should fail validation when passing non-latin string', function() {
      const input = { value: 'adsdasio ער' }
      try {
        validators.validate(input, this.schema)
        throw new Error('It should not go to this scope')
      } catch (err) {
        err.should.be.an.instanceof(appErrors.ValidationError)
      }
    })

    it('should pass validation when passing latin string', function() {
      const input = { value: '+ěščřžýáíáíéú).[].sssdafaioj' }
      return validators.validate(input, this.schema).errors.should.be.empty
    })
  })
})

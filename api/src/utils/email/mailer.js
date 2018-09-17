/* eslint-disable max-len */
'use strict'

const sgMail = require('@sendgrid/mail')
const config = require('../../../../config')

sgMail.setApiKey(config.sendgrid.apiKey)

module.exports = {
  sendResetPasswordEmail,
  sendInviteEmail,
  sendChangePasswordEmail,
}

function sendResetPasswordEmail(options) {
  if (!options || !options.toAddress || !options.resetPasswordToken || !options.fullName) {
    throw new Error('Incomplete options for sendResetPasswordEmail supplied.')
  }
  const msg = {
    to: options.toAddress,
    from: config.sendgrid.fromAddress,
    subject: 'Reset password',
    text: `Hi ${options.fullName}.\n You can reset your password here: ${config.hostname}/auth/reset-password/${options.resetPasswordToken} If you haven't requested password change, please ignore this message.`,
  }
  sgMail.send(msg)
}

function sendInviteEmail(options) {
  if (!options || !options.toAddress || !options.confirmToken || !options.fullName) {
    throw new Error('Incomplete options for sendResetPasswordEmail supplied.')
  }
  const msg = {
    to: options.toAddress,
    from: config.sendgrid.fromAddress,
    subject: 'Welcome to MaSo!',
    text: `Hi ${options.fullName}.\n Welcome to MaSo. Please confirm your email here: ${config.hostname}/auth/confirm-registration/${options.confirmToken}`,
  }
  sgMail.send(msg)
}

function sendChangePasswordEmail(options) {
  if (!options || !options.toAddress || !options.fullName) {
    throw new Error('Incomplete options for sendResetPasswordEmail supplied.')
  }
  const msg = {
    to: options.toAddress,
    from: config.sendgrid.fromAddress,
    subject: 'Password changed',
    text: `Hi ${options.fullName}. You password has been changed. If you haven't done so, please contact support as soon as possible.`,
  }
  sgMail.send(msg)
}


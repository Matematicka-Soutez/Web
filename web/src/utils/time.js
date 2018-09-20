/* eslint-disable no-nested-ternary */

function formattedMS(ms) {
  let result = ''
  const sec = Math.round(ms / 1000)
  const days = Math.floor(sec / (60 * 60 * 24))
  if (days > 0) {
    result += `${days} ${days === 1 ? 'den' : [2, 3, 4].includes(days) ? 'dny' : 'dní'} `
  }
  const hours = Math.floor(sec / (60 * 60)) - (days * 24)
  if (result !== '' || hours > 0) {
    result += `${hours} ${hours === 1 ? 'hodinu' : [2, 3, 4].includes(hours) ? 'hodiny' : 'hodin'} `
  }
  const minutes = Math.floor(sec / 60) - ((hours + (days * 24)) * 60)
  if (result !== '' || minutes > 0) {
    result += `${minutes} ${minutes === 1 ? 'minutu' : [2, 3, 4].includes(minutes) ? 'minuty' : 'minut'} ` // eslint-disable-line max-len
  }
  const remainingSecs = sec - ((minutes + ((hours + (days * 24)) * 60)) * 60)
  const secondsNoun = remainingSecs === 1 ? 'vteřinu' : [2, 3, 4].includes(remainingSecs) ? 'vteřiny' : 'vteřin' // eslint-disable-line max-len
  return `${result !== '' ? `${result}a ` : ''}${remainingSecs} ${secondsNoun}`
}

module.exports = {
  formattedMS,
}

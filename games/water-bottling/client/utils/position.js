function getRowLetter(index) {
  return String.fromCharCode(64 + index)
}

function getPosition(position) {
  const letter = getRowLetter(position.grid.height - position.vertical + 1)
  return `${letter}${position.horizontal}`
}

module.exports = {
  getPosition,
  getRowLetter,
}

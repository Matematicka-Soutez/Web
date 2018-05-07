function getFieldColor(waterFlow) {
  const frequency = 0.18
  const center = 192
  const width = 63
  const i = (25 - waterFlow) + 25
  const red = (Math.sin(frequency * i) * width) + center
  const green = (Math.sin((frequency * i) + 1) * width) + center
  const blue = (Math.sin((frequency * i) + 2) * width) + center
  return `rgb(${red},${green},${blue})`
}

module.exports = {
  getFieldColor,
}

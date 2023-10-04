function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomCoordinates(max_x, max_y) {
  let x = Math.floor(Math.random() * max_x)
  let y = Math.floor(Math.random() * max_y)
  return { x, y }
}

module.exports.randInt = getRandomInt

module.exports.randCoordinates = getRandomCoordinates
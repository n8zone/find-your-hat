function randomChoice(obj) {
  const index = Math.floor(Math.random() * obj.length);
  return obj[index];
}

module.exports = randomChoice;
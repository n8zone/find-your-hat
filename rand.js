function randomChoice(arr) {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

module.exports = randomChoice;
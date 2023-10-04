const { randInt, randCoordinates } = require('./rand_int')
const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.field = Array.from({ length: w }, () => new Array(h));
    for (let i = 0; i < this.field.length; i++) {
      let row = this.field[i]
      for (let j = 0; j < row.length; j++) {
        row[j] = fieldCharacter
      }
    }

    this.holes = this.generateHoles()

  }
  displayField() {
    const gameMap = this.field.map((row) => {
      return row.join('')
    }).join('\n')
    console.log(gameMap);
  }
  generateHoles() {
    let holes = []
    for (let i = 0; i < 5; i++) {
      let holeCoordinates = randCoordinates(this.w, this.h)
      this.field[holeCoordinates.x][holeCoordinates.y] = hole;
      holes.push(holeCoordinates)
    }
    return holes
  }
}

const GRID_X = 5
const GRID_Y = 8

let player_pos = { x: 0, y: 0 }
let hat_pos = {...randCoordinates(GRID_X, GRID_Y)}
console.log(hat_pos)

const game = new Field(GRID_X, GRID_Y)

game.field[hat_pos.x][hat_pos.y] = hat;

const DIRECTIONS = {
  'left': [-1, 0],
  'right': [1, 0],
  'up': [0, -1],
  'down': [0, 1]
}

function checkOOB() {
  if ((player_pos.x >= GRID_X || player_pos.x < 0) || (player_pos.y >= GRID_Y || player_pos.y < 0)) {
    return true
  }
  return false
}

function checkWin() {
  if (player_pos.x === hat_pos.x && player_pos.y === hat_pos.y) {
    return true
  }
  return false
}

function checkHoles() {
  let inHole = false
  game.holes.forEach((hole) => {
    if (player_pos.x === hole.x && player_pos.y === hole.y) {
      inHole = true;
      return;
    }
  })
  return inHole
}

function move(data) {
  let dir = data.toString().trim();
  dir = DIRECTIONS[dir.toLowerCase()];
  oldPos = { ...player_pos };
  //game.field[player_pos.x][player_pos.y] = fieldCharacter;

  player_pos.x += dir[1];
  player_pos.y += dir[0];
  if (checkOOB()) {
    console.log("You can't move in that direction!");
    player_pos = { ...oldPos };
  }
  if (checkHoles()) {
    console.log("You lose!")
    return
  }
  game.field[player_pos.x][player_pos.y] = pathCharacter;
  console.log(player_pos);
  game.displayField();
  if (checkWin()) {
    console.log("You won!!")
  }
}

game.field[player_pos.x][player_pos.y] = pathCharacter;
game.displayField()
let f = process.stdin.on('data', move)
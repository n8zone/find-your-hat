const { getDist, randCoordinates, areEqual, addCoord } = require('./coordinates')
const randomChoice = require('./rand')
const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
	constructor(w, h) {
		this.w = w;
		this.h = h;

		this.field = this.generateField(w, h)
		this.holes = this.generateHoles()
		this.hat = this.generateHat()
		console.log(this.isSolvable())

	}
	generateField(w, h) {
		let field = Array.from({ length: w }, () => new Array(h));
		for (let i = 0; i < field.length; i++) {
			let row = field[i]
			for (let j = 0; j < row.length; j++) {
				row[j] = fieldCharacter
			}
		}
		return field
	}

	displayField() {
		const gameMap = this.field.map((row) => {
			return row.join('')
		}).join('\n')
		console.log(gameMap);
	}
	generateHoles() {
		let holes = []
		for (let i = 0; i < Math.floor(this.w * this.h * 0.33); i++) {
			let holeCoordinates = randCoordinates(this.w, this.h)
			this.field[holeCoordinates.x][holeCoordinates.y] = hole;
			holes.push(holeCoordinates)
		}
		return holes
	}
	generateHat(cycles = 0) {
		if (cycles > 15) {
			console.error("Too many failed attempts to find valid hat location!");
			return;
		}

		let hat_pos = { ...randCoordinates(this.w, this.h) };
		if ((getDist(hat_pos, { x: 0, y: 0 }) < 2) || this.isHole(hat_pos)) {
			return this.generateHat(++cycles)
		}
		this.field[hat_pos.x][hat_pos.y] = hat
		return hat_pos
	}
	isHole(check) {
		if (this.field[check.x][check.y] === hole) {
			return true
		}
		return false
	}
	isHat(check) {
		if (this.field[check.x][check.y] === hat) {
			return true
		}
		return false
	}
	canMove(check) {
		let reachable = false
		let directions = [
			{ x: -1, y: 0 },
			{ x: 1, y: 0 },
			{ x: 0, y: -1 },
			{ x: 0, y: 1 }
		]
		
		directions.forEach((dir) => {
			const newPos = addCoord(check, dir);
			if ((newPos.x < 0 || newPos.x >= this.w) || (newPos.y < 0 || newPos.y > this.h)) {
				return;
			}

			try {
				const gridCheck = this.field[newPos.x][newPos.y]
				if (gridCheck !== hole ) {
					reachable = true;
				}
			} catch {
				return
			}


		})

		return reachable
		
	}
	isSolvable(cycles = 0, remainingDirections = ['l','r','u','d'], pointer_pos = {x: 0, y: 0}) {
		// known issues
		// 1. Right now if the player is initially trapped in a little box it'll jump around the safe areas until algo reaches cycle limit
		console.log(cycles)
		if (cycles > 5000 || remainingDirections.length === 0) { // If it's exhausted all directions, its also not solvable
			console.error("Maze could not be solved in time limit!")
			return false
		}

		if (!this.canMove(this.hat) || !this.canMove(pointer_pos)) { // so we don't waste 5000 cycles to find out the hat/player is blocked on all sides
			console.error("Unsolvable!")
			return false
		}

		// const DIRECTIONS = {
		// 	'l': [-1, 0],
		// 	'r': [1, 0],
		// 	'u': [0, -1],
		// 	'd': [0, 1]
		// }

		const DIRECTIONS = [
			{x: -1, y: 0},
			{x: 1, y : 0},
			{x: 0, y: -1},
			{x: 0, y: 1}
		]
		

		let next_dir = randomChoice(remainingDirections)
		const next_directions = remainingDirections.filter(d => d !== next_dir) // remove next direction from the choices for next cycle ...
		
		next_dir = DIRECTIONS[next_dir]
	
		const next_pos = {
			x: pointer_pos.x + next_dir[0],
			y: pointer_pos.y + next_dir[1]
		}

		if (next_pos.x < 0) {
			next_pos.x = 0;
			return this.isSolvable(cycles, next_directions, pointer_pos)
		}
		else if (next_pos.x >= this.w) {
			next_pos.x = this.w - 1;
			return this.isSolvable(cycles, next_directions, pointer_pos)
		}

		if (next_pos.y < 0) {
			next_pos.y = 0;
			return this.isSolvable(cycles, next_directions, pointer_pos)
		}
		else if (next_pos.y >= this.w) {
			next_pos.y = this.w - 1;
			return this.isSolvable(cycles, next_directions, pointer_pos)
		}

		if (this.isHole(next_pos)) {
			console.log("HOLE")
			return this.isSolvable(++cycles, next_directions, pointer_pos)
		}

		if (areEqual(next_pos, pointer_pos)) {
			return this.isSolvable(++cycles, next_directions, pointer_pos)
		}

		if (this.isHat(next_pos)) {
			console.log("SOLVABLE")
			return true;
		}
		console.log("safe!")
		remainingDirections = ['l','r','u','d']
		remainingDirections.filter((d) => { // this should filter out the opposite direction, not the one we just used.
			return d !== next_dir
		})
		return this.isSolvable(cycles, remainingDirections, next_pos)

	}
}

const GRID_X = 16
const GRID_Y = 16

let player_pos = { x: 0, y: 0 }

const game = new Field(GRID_X, GRID_Y)


const DIRECTIONS = {
	'l': [-1, 0],
	'r': [1, 0],
	'u': [0, -1],
	'd': [0, 1]
}

function checkOOB() {
	if ((player_pos.x >= GRID_X || player_pos.x < 0) || (player_pos.y >= GRID_Y || player_pos.y < 0)) {
		return true
	}
	return false
}

function checkWin() {
	if (player_pos.x === game.hat.x && player_pos.y === game.hat.y) {
		return true
	}
	return false
}

function checkHoles() {
	return game.isHole(player_pos)
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
		process.exit()
	}
	game.field[player_pos.x][player_pos.y] = pathCharacter;
	console.log(player_pos);
	game.displayField();
	if (checkWin()) {
		console.log("You won!!")
		process.exit()
	}
}

game.field[player_pos.x][player_pos.y] = pathCharacter;
game.displayField()
//process.stdin.on('data', move)
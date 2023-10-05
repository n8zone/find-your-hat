function getRandomCoordinates(max_x, max_y) {
	let x = Math.floor(Math.random() * max_x)
	let y = Math.floor(Math.random() * max_y)
	return { x, y }
}

function getDist(a, b) {
	const { x: ax, y: ay } = a;
	const { x: bx, y: by } = b;

	return Math.sqrt(Math.pow(bx - ax, 2) + Math.pow(by - ay, 2))
}

function flipCoord(c) {
	nx = c.x !== 0 ? c.x * -1 : 0;
	ny = c.y !== 0 ? c.y * -1 : 0;
	return { x: nx, y: ny }
}

function areEqual(a, b) {
	return a.x === b.x && a.y === b.y
}

function addCoord(a, b) {
	return { x: a.x + b.x, y: a.y + b.y }
}

module.exports.getDist = getDist
module.exports.areEqual = areEqual
module.exports.addCoord = addCoord
module.exports.flipCoord = flipCoord

module.exports.randCoordinates = getRandomCoordinates
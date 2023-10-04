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

function areEqual(a, b) {
	return a.x === b.x && a.y === b.y
}

module.exports.getDist = getDist
module.exports.areEqual = areEqual

module.exports.randCoordinates = getRandomCoordinates
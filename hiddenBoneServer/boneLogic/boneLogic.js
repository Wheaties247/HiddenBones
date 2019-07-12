const functs = require("./boneCheckFunctions.js")
const boneLogic = {};

boneLogic.tileLogic = (req, res, next) =>{
	console.log("req.params", req.params)
	const rows = parseInt(req.params.rows)
	const columns = parseInt(req.params.columns)

	const tileLogicArray = []
	const spaces = rows * columns
	for (let i = 0; i < rows; i++) {
		const column = Array(columns).fill(null)
		tileLogicArray.push(column)
	}
	res.locals.tileLogicArray = tileLogicArray
	res.locals.spaces = spaces
	res.locals.rows = rows
	res.locals.columns = columns

    next();

}
boneLogic.createBones = (req, res, next) =>{
	const spaces = res.locals.spaces
	const halfSpaces = spaces / 2
		let boneTotal = 0
		const bonesToPlace = []
		let counter = 2
		while (boneTotal < halfSpaces) {
			if (counter > 5) {
				counter = 2;
			}
			if (counter === 2) {
				boneTotal += 2;
				bonesToPlace.push(2);
			}
			if (counter === 3) {
				boneTotal += 3;
				bonesToPlace.push(3);
			}
			if (counter === 4) {
				boneTotal += 4;
				bonesToPlace.push(4);
			}
			if (counter === 5) {
				boneTotal += 5;
				bonesToPlace.push(5);
			}
			counter++;
		}
		bonesToPlace.sort((a, b) => b - a);
		res.locals.bonesToPlace = bonesToPlace;
		next();
}


boneLogic.placeBones = (req, res, next) =>{
	const rows = res.locals.rows
	const columns = res.locals.columns
	const bonesToPlace = res.locals.bonesToPlace
	let tileLogicArray = res.locals.tileLogicArray
	for (let i = 0; i < bonesToPlace.length; i++) {
			// const randomRowIndex = this.randomNumber(rowIndexLimit)

			let boneFits = false
			let boneSpace = false
			console.log(`FOR loop`)
			while (!boneFits || !boneSpace) {
				let randomRowIndex = functs.randomNumber(rows)
				let randomColIndex = functs.randomNumber(columns)
				let coordinates = [randomRowIndex, randomColIndex]
				let answerArray = functs.canBoneFitQuery(coordinates, bonesToPlace[i], rows, columns)
				// if(answerArra)
				console.log(`WHILE loop
				current Bone : 
				${bonesToPlace[i]}
				 answerArray: 
				${answerArray}
				coordinates : 
				${coordinates}`)
				boneFits = answerArray[0]

				if (boneFits) {
					const direction = answerArray[1]
					const addOrSub = answerArray[2]
					boneSpace = functs.hasSpaceQuery(
						coordinates,
						bonesToPlace[i],
						direction,
						addOrSub,
						tileLogicArray
					)
					console.log(`BONE FITS BUT...
									boneSpace :
									${boneSpace}`)
					if (boneSpace) {
						const logicAppend = functs.addBoneToTileLogic(
							coordinates,
							bonesToPlace[i],
							direction,
							addOrSub,
							tileLogicArray
						)
						tileLogicArray = logicAppend
						console.log(`ArrayCheck :${tileLogicArray} i : ${i} `, )
					}
				}
				console.log(`END OF WHILE LOOP
					boneFits : ${boneFits}
					boneSpace : ${boneSpace}`)
			}

			console.log(`OUTSIDE while loop`)
		}
		res.locals.newLogicArray = tileLogicArray
		next();
}

module.exports = boneLogic;

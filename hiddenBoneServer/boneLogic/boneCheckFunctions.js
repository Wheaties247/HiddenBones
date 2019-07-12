const randomNumber = number=> {
		const random = Math.floor(Math.random() * number)
		console.log(`randomNumber : ${random}`)
		return random
	}
const canBoneFitQuery=(coordinates, boneSize, rows, columns)=> {
		let vertOrHorizontal = randomNumber(2)

		const boneAndStartPoint = boneSize - 1
		const colIndexLimit = columns - 1
		const rowIndexLimit = rows - 1
		console.log(`current params
				 Bone Size: 
				${boneSize}
				coordinates : 
				${coordinates}`)
		if (vertOrHorizontal) {
			//if value is 1 direction is vertical
			let directional = vertOrHorizontal ? "vert" : "hor"
			const addCheck = coordinates[0] + boneAndStartPoint

			if (addCheck <= rowIndexLimit) {
				console.log(`fitCheck 
						true: add
						direction ${directional}
						coordinates ${coordinates}`)
				return [true, directional, "add"]
			} else {
				const subCheck = coordinates[0] - boneAndStartPoint
				if (subCheck >= 0) {
					console.log(`fitCheck 
						true: sub
						direction ${directional}
						coordinates ${coordinates}`)

					return [true, directional, "sub"]
				} else {
					console.log(`fitCheck
					 false:
					direction ${directional}`)
					return [false, directional]
				}
			}
		} else {
			let directional = vertOrHorizontal ? "vert" : "hor"
			const addCheck = coordinates[1] + boneAndStartPoint
			if (addCheck <= colIndexLimit) {
				console.log(`fitCheck 
						true: add
						direction ${directional}
						coordinates ${coordinates}`)
				return [true, directional, "add"]
			} else {
				const subCheck = coordinates[1] - boneAndStartPoint
				if (subCheck >= 0) {
					console.log(`fitCheck 
						true: add
						direction ${directional}
						coordinates ${coordinates}`)
					return [true, directional, "sub"]
				} else {
					console.log(`fitCheck 
						false:
					direction ${directional}`)
					return [false]
				}
			}
		}
	}
const hasSpaceQuery = (coordinates, boneSize, direction, addOrSub, tileLogicArray) => {
		// const { tileLogicArray } = this.state
		console.log(`WITHIN boneSpaceQuery :
				tileLogicArray:
				 ${JSON.stringify(tileLogicArray)}`)
		let row = coordinates[0]
		let column = coordinates[1]
		if (direction === "hor") {
			if (addOrSub === "add") {
				for (let i = 0; i < boneSize; i++) {
					let freeSpaceQuery = tileLogicArray[row][column + i]
					console.log(`boneSpaceQuery :
								direction : ${direction}
								addOrSub : ${addOrSub}
							 	freeSpaceQuery : ${freeSpaceQuery}`)
					if (freeSpaceQuery) {
						return false // only runs if freeSpaceQuery is not falsy
					}
				}
				return true //only runs if all iterations are null
			}
			if (addOrSub === "sub") {
				for (let i = 0; i < boneSize; i++) {
					let freeSpaceQuery = tileLogicArray[row][column - i]
					console.log(`boneSpaceQuery :
								direction : ${direction}
								addOrSub : ${addOrSub}
								freeSpaceQuery : ${freeSpaceQuery}`)
					if (freeSpaceQuery) {
						return false // only runs if freeSpaceQuery is not falsy
					}
				}
				return true //only runs if all iterations are null
			}
		}
		if (direction === "vert") {
			if (addOrSub === "add") {
				for (let i = 0; i < boneSize; i++) {
					let freeSpaceQuery = tileLogicArray[row + i][column]
					console.log(`boneSpaceQuery :
								direction : ${direction}
								addOrSub : ${addOrSub}
							 	freeSpaceQuery : ${freeSpaceQuery}`)
					if (freeSpaceQuery) {
						return false // only runs if freeSpaceQuery is not falsy
					}
				}
				return true //only runs if all iterations are null
			}
			if (addOrSub === "sub") {
				for (let i = 0; i < boneSize; i++) {
					let freeSpaceQuery = tileLogicArray[row - i][column]
					console.log(`boneSpaceQuery :
								direction : ${direction}
								addOrSub : ${addOrSub}
								freeSpaceQuery : ${freeSpaceQuery}`)
					if (freeSpaceQuery) {
						return false // only runs if freeSpaceQuery is not falsy
					}
				}
				return true //only runs if all iterations are null
			}
		}
	}
const addBoneToTileLogic = (coordinates, boneSize, direction, addOrSub, tileLogicArray) => {
		console.log(`WITHIN addBoneToTileLogic :
				tileLogicArray:
				 ${JSON.stringify(tileLogicArray)}`)
		let row = coordinates[0]
		let column = coordinates[1]
		let logicArray = tileLogicArray

		if (direction === "hor") {
			if (addOrSub === "add") {
				for (let i = 0; i < boneSize; i++) {
					logicArray[row][column + i] = boneSize
				}
			}
			if (addOrSub === "sub") {
				for (let i = 0; i < boneSize; i++) {
					logicArray[row][column - i] = boneSize
				}
			}
		}
		if (direction === "vert") {
			if (addOrSub === "add") {
				for (let i = 0; i < boneSize; i++) {
					logicArray[row + i][column] = boneSize
				}
			}
			if (addOrSub === "sub") {
				for (let i = 0; i < boneSize; i++) {
					logicArray[row - i][column] = boneSize
				}
			}
		}
		  return logicArray 
	}
module.exports = {canBoneFitQuery, randomNumber, hasSpaceQuery, addBoneToTileLogic}
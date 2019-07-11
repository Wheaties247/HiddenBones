import React from "react"
import hiddenBoneStyles from "../styles/hidden-bones.module.css"
import InitGame from "./InitGame"
import Tileboard from "./Tileboard"
import Tile from "./Tile"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"
const axios = require("axios")

const {
	hiddenBonesLanding,
	gameBoardHolder,
	gameInfo,
	gameTitle,
	scoreboard,
	gameLabels,
} = hiddenBoneStyles
class HiddenBones extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			initError: "",
			showInitGame: true,
			columns: null,
			rows: null,
			tileLogicArray: null,
			tileContent: [],
			winQuery: false,
			loseQuery: 0,
			misses: 0,
			initGame: false,
			bonesToGo: 0,
			markedTile: [],
			tileboardWidth: 0,
			tileboardHeight: 0,
		}
		this.newGame = this.newGame.bind(this)
		this.playAgain = this.playAgain.bind(this)
		this.showMovesToWin = this.showMovesToWin.bind(this)
		this.startGame = this.startGame.bind(this)
		this.cordinateDisplayCalc = this.cordinateDisplayCalc.bind(this)
		this.tileLogic = this.tileLogic.bind(this)
		this.generateTiles = this.generateTiles.bind(this)
		this.createBones = this.createBones.bind(this)
		this.placeBones = this.placeBones.bind(this)
		this.canBoneFitQuery = this.canBoneFitQuery.bind(this)
		this.boneSpaceQuery = this.boneSpaceQuery.bind(this)
		this.addBoneToTileLogic = this.addBoneToTileLogic.bind(this)
		this.markTile = this.markTile.bind(this)
		this.checkWin = this.checkWin.bind(this)
		this.addWinArray = this.addWinArray.bind(this)
		this.checkLose = this.checkLose.bind(this)
	}
	cordinateDisplayCalc(tileKey) {
		const { rows, columns } = this.state
		let resultString = ""
		if (tileKey < columns) {
			resultString += "(1 , "
		} else {
			resultString += "(" + Math.ceil(tileKey / rows) + " ,"
		}
		console.log("resultString", resultString)
	}
	startGame(data) {
		const { rows, columns } = data
		const validRows = this.truthyQuery(rows)
		const validColumns = this.truthyQuery(columns)
		const intRows = Math.round(parseInt(rows))
		const intColumns = Math.round(parseInt(columns))

		if (validRows && validColumns) {
			if (intColumns > 3 && intRows > 3) {
				const spaces = intColumns * intRows
				const contentArray = Array(spaces).fill(`unclicked`)
				const loseQuery = Math.floor(spaces / 3)
				this.setState(prevState => {
					
					prevState.columns = intColumns
					prevState.rows = intRows
					prevState.tileContent = contentArray
					prevState.loseQuery = loseQuery
					prevState.tileboardHeight = intColumns * 150
					prevState.tileboardWidth = intRows * 150
					prevState.showInitGame = false
					return prevState
				})
			} else {
				// 	console.log(
				// `startGame,
				// choose numbers greater than 3 for rows and columns
				// `)
				this.setState({
					initError:
						"Please Choose numbers greater than 3 for the initial Rows and Columns",
				})
			}
		}
	}
	truthyQuery(data) {
		return data !== ""
	}
	tileLogic() {
		const { rows, columns } = this.state
		axios
			.post(`http://localhost:7770/logic/${rows}/${columns}`)
			.then(res => console.log("fetch complete", res))
			.catch(err => {
				console.log("there was an error in fetch", err)
				//error message in console if the was an issue with the error with respective error output
			})
		const array = []
		const spaces = rows * columns
		for (let i = 0; i < rows; i++) {
			const column = Array(columns).fill(null)
			array.push(column)
		}
		// console.log("populated Array", array)
		this.setState({ tileLogicArray: array, initGame: true }, () => {
			console.log("INIT GAME: TRUE")
			this.createBones(spaces)
		})
	}
	generateTiles(data) {
		// console.log("generateTiles")

		const { rows, columns, tileContent } = this.state
		const width = 1 / columns
		const height = 1 / rows
		const widthPercent = width * 100 + "%"
		const heightPercent = height * 100 + "%"
		const dimension = {
			width: widthPercent,
			height: heightPercent,
		}
		const holdsTiles = []
		const spaces = rows * columns

		for (let i = 0; i < spaces; i++) {
			// const tileNumber = i+1
			this.cordinateDisplayCalc(i)
			holdsTiles.push(
				<Tile
					picData={data}
					key={i}
					tileId={i}
					rows={rows}
					columns={columns}
					dimension={dimension}
					content={tileContent[i]}
					handleClick={() => this.markTile(i)}
				/>
			)
		}
		return holdsTiles
	}
	markTile(tile) {
		// console.log(`Tile # ${tile}`)
		let counter = 0
		const { rows, columns, tileLogicArray, markedTile } = this.state
		if (!markedTile.includes(tile)) {
			for (let rowCount = 0; rowCount < rows; rowCount++) {
				for (let colCount = 0; colCount < columns; colCount++) {
					console.log(`current Iteration : 
			 				tile: ${tile}
			 				columns: ${colCount}
			 				rows: ${rowCount}
			 				counter: ${counter}`)

					if (counter === tile) {
						const tileContent = tileLogicArray[rowCount][colCount]
						console.log(`tileContent : ${tileContent}`)

						return this.setState(
							prevState => {
								prevState.markedTile.push(tile)
								prevState.tileContent[counter] = tileContent
								if (tileContent !== null) {
									const boneIndex = prevState.bonesToGo.indexOf(tileContent)

									prevState.bonesToGo.splice(boneIndex, 1)
								}
								return prevState
							},
							() => {
								this.checkLose()
								// console.log(`CheckWinCALLBACK ${winQuery}`)
								const winQuery = this.checkWin()
								if (winQuery) {
									console.log("You Win!")

									this.setState({ winQuery: true })
								}
							}
						)
						// console.log(`tile Clicked : ${tile}`)
					}
					counter++
				}
			}
		}
	}
	checkLose() {
		const { tileContent } = this.state
		let missCount = 0
		for (let i = 0; i < tileContent.length; i++) {
			if (tileContent[i] === null) {
				missCount++
			}
		}
		this.setState({ misses: missCount })
	}
	checkWin() {
		const { bonesToGo } = this.state
		if (bonesToGo.length) {
			return false
		} else {
			return true
		}
	}
	createBones(spaces) {
		const halfSpaces = spaces / 2
		let boneTotal = 0
		const boneArray = []
		let counter = 2
		while (boneTotal < halfSpaces) {
			if (counter > 5) {
				counter = 2
			}
			if (counter === 2) {
				boneTotal += 2
				boneArray.push(2)
			}
			if (counter === 3) {
				boneTotal += 3
				boneArray.push(3)
			}
			if (counter === 4) {
				boneTotal += 4
				boneArray.push(4)
			}
			if (counter === 5) {
				boneTotal += 5
				boneArray.push(5)
			}
			counter++
		}
		boneArray.sort((a, b) => b - a)

		console.log("boneArray", boneArray)
		this.placeBones(boneArray)
	}
	placeBones(boneArray) {
		const { rows, columns } = this.state
		// const colIndexLimit = columns - 1
		// const rowIndexLimit = rows - 1
		for (let i = 0; i < boneArray.length; i++) {
			// const randomRowIndex = this.randomNumber(rowIndexLimit)

			let boneFits = false
			let boneSpace = false
			console.log(`FOR loop`)
			while (!boneFits || !boneSpace) {
				let randomRowIndex = this.randomNumber(rows)
				let randomColIndex = this.randomNumber(columns)
				let coordinates = [randomRowIndex, randomColIndex]
				let answerArray = this.canBoneFitQuery(coordinates, boneArray[i])
				// if(answerArra)
				console.log(`WHILE loop
				current Bone : 
				${boneArray[i]}
				 answerArray: 
				${answerArray}
				coordinates : 
				${coordinates}`)
				boneFits = answerArray[0]

				if (boneFits) {
					const direction = answerArray[1]
					const addOrSub = answerArray[2]
					boneSpace = this.boneSpaceQuery(
						coordinates,
						boneArray[i],
						direction,
						addOrSub
					)
					console.log(`BONE FITS BUT...
									boneSpace :
									${boneSpace}`)
					if (boneSpace) {
						this.addBoneToTileLogic(
							coordinates,
							boneArray[i],
							direction,
							addOrSub
						)
					}
				}
				console.log(`END OF WHILE LOOP
					boneFits : ${boneFits}
					boneSpace : ${boneSpace}`)
			}

			console.log(`OUTSIDE while loop`)
			this.setState({ initGame: false }, () => console.log("INIT GAME : FALSE"))
		}
	}
	addBoneToTileLogic(coordinates, boneSize, direction, addOrSub) {
		const { tileLogicArray } = this.state
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
		this.setState({ tileLogicArray: logicArray }, () => {
			this.addWinArray()
		})
	}
	addWinArray() {
		const winArray = []
		const { rows, columns, tileLogicArray } = this.state
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < columns; c++) {
				if (typeof tileLogicArray[r][c] === "number") {
					winArray.push(tileLogicArray[r][c])
				}
			}
		}
		winArray.sort((a, b) => b - a)
		this.setState({ bonesToGo: winArray })
		console.log("addWin Array Running")
	}
	boneSpaceQuery(coordinates, boneSize, direction, addOrSub) {
		const { tileLogicArray } = this.state
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
	canBoneFitQuery(coordinates, boneSize) {
		let vertOrHorizontal = this.randomNumber(2)

		const boneAndStartPoint = boneSize - 1
		const { rows, columns } = this.state
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
	randomNumber(number) {
		const random = Math.floor(Math.random() * number)
		console.log(`randomNumber : ${random}`)
		return random
	}
	showMovesToWin(data) {
		const { dogBone, dinoSkull, skull, fish } = data
		const { bonesToGo } = this.state

		let twoSize = 0
		let threeSize = 0
		let fourSize = 0
		let fiveSize = 0

		for (let i = 0; i < bonesToGo.length; i++) {
			if (bonesToGo[i] === 2) {
				twoSize++
			}
			if (bonesToGo[i] === 3) {
				threeSize++
			}
			if (bonesToGo[i] === 4) {
				fourSize++
			}
			if (bonesToGo[i] === 5) {
				fiveSize++
			}
		}
		let holdsRender = (
			<div className="holdsRender">
				{twoSize ? (
					<div className={scoreboard}>
						<div className="imgDiv">
							<Img fluid={dogBone.childImageSharp.fluid} alt="bone" />
						</div>
						<div>
							<h6 className={gameLabels}> X {twoSize}</h6>
						</div>
					</div>
				) : null}
				{threeSize ? (
					<div className={scoreboard}>
						<div className="imgDiv">
							<Img fluid={fish.childImageSharp.fluid} alt="bone" />
						</div>
						<div>
							<h6 className={gameLabels}> X {threeSize}</h6>
						</div>
					</div>
				) : null}
				{fourSize ? (
					<div className={scoreboard}>
						<div className="imgDiv">
							<Img fluid={skull.childImageSharp.fluid} alt="bone" />
						</div>
						<div>
							<h6 className={gameLabels}> X {fourSize}</h6>
						</div>
					</div>
				) : null}
				{fiveSize ? (
					<div className={scoreboard}>
						<div className="imgDiv">
							<Img fluid={dinoSkull.childImageSharp.fluid} alt="bone" />
						</div>
						<div>
							<h6 className={gameLabels}> X {fiveSize}</h6>
						</div>
					</div>
				) : null}
			</div>
		)
		return holdsRender
	}
	newGame() {
		console.log("NewGame")
		this.setState({
			showInitGame: true,
			loseQuery: 0,
			bonesToGo: 0,
			markedTile: [],
			tileContent: [],
			winQuery: false,
			misses: 0,
		})
	}
	playAgain() {
		this.setState(
			{
				showInitGame: true,
				loseQuery: 0,
				bonesToGo: 0,
				markedTile: [],
				tileContent: [],
				winQuery: false,
				misses: 0,
			},
			() => this.startGame(this.state)
		)
	}
	render() {
		return (
			<StaticQuery
				query={graphql`
					{
						dogBone: file(relativePath: { eq: "dogBone.png" }) {
							childImageSharp {
								fluid(maxWidth: 900) {
									...GatsbyImageSharpFluid
								}
							}
						}
						dinoSkull: file(relativePath: { eq: "dinoSkull.png" }) {
							childImageSharp {
								fluid(maxWidth: 900) {
									...GatsbyImageSharpFluid
								}
							}
						}
						skull: file(relativePath: { eq: "skull.png" }) {
							childImageSharp {
								fluid(maxWidth: 900) {
									...GatsbyImageSharpFluid
								}
							}
						}
						fish: file(relativePath: { eq: "fish.png" }) {
							childImageSharp {
								fluid(maxWidth: 900) {
									...GatsbyImageSharpFluid
								}
							}
						}
					}
				`}
				render={data => {
					const {
						showInitGame,
						initError,
						winQuery,
						loseQuery,
						misses,
						initGame,
						tileboardHeight,
						tileboardWidth,
					} = this.state
					const {
						startGame,
						handleAsyncState,
						tileLogic,
						generateTiles,
						showMovesToWin,
						newGame,
						playAgain,
					} = this
					return (
						<div className={hiddenBonesLanding}>
							<h1 className={gameTitle}>Hidden Bones</h1>
							<div className={gameInfo}>
								<div className="gameUI">{showMovesToWin(data)}</div>
								<div className="gameUI">
									{showInitGame ? null : (
										<h1 className="loseLabel">
											To lose {misses}/{loseQuery}
										</h1>
									)}
								</div>
							</div>
							<div className={gameBoardHolder}>
								{showInitGame ? (
									<InitGame
										handleAsyncState={handleAsyncState}
										startGame={startGame}
										initError={initError}
									/>
								) : (
									<Tileboard
										tileboardHeight={tileboardHeight}
										tileboardWidth={tileboardWidth}
										playAgain={playAgain}
										newGame={newGame}
										picData={data}
										initGame={initGame}
										loseQuery={loseQuery}
										misses={misses}
										winQuery={winQuery}
										generateTiles={generateTiles}
										tileLogic={tileLogic}
									/>
								)}
							</div>
						</div>
					)
				}}
			/>
		)
	}
}
export default HiddenBones

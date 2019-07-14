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
			loading:false
		}
		this.newGame = this.newGame.bind(this)
		this.playAgain = this.playAgain.bind(this)
		this.showMovesToWin = this.showMovesToWin.bind(this)
		this.startGame = this.startGame.bind(this)
		this.cordinateDisplayCalc = this.cordinateDisplayCalc.bind(this)
		this.tileLogic = this.tileLogic.bind(this)
		this.generateTiles = this.generateTiles.bind(this)



		this.markTile = this.markTile.bind(this)
		this.checkWin = this.checkWin.bind(this)
		this.checkLose = this.checkLose.bind(this)
	}
	cordinateDisplayCalc(tileKey) {
		const { rows, columns } = this.state
		console.log(`cordinateDisplayCalc -
			rows : ${rows}
			columns${columns}`)
		let resultString = ""
		if (tileKey < columns) {
			resultString += "(1 , "
			//returns well
		} else {
			resultString += "(" + (1 + Math.floor(tileKey / rows) )+ " ,"
		}
		const getCol = (tileKey+1) % rows
		if(getCol){
			resultString += (getCol +" )")
		}else{
			resultString += (rows +" )")
		}
		return resultString
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
					prevState.loading = true
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
			.then(res => {
				const {tileLogicArray, winArray} = res.data 
				console.log("fetch complete", res)
				this.setState({ 
					tileLogicArray: tileLogicArray, bonesToGo:winArray,
					loading:false
				})
			})
			.catch(err => {
				console.log("there was an error in axios request", err)
				//error message in console if the was an issue with the error with respective error output
			})
		// const array = []
		// const spaces = rows * columns
		// for (let i = 0; i < rows; i++) {
		// 	const column = Array(columns).fill(null)
		// 	array.push(column)
		// }
		// // console.log("populated Array", array)
		// this.setState({ tileLogicArray: array, initGame: true }, () => {
		// 	console.log("INIT GAME: TRUE")
		// 	// this.createBones(spaces)
		// })
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
			const marker = this.cordinateDisplayCalc(i)
			holdsTiles.push(
				<Tile
					picData={data}
					key={i}
					tileId={i}
					rows={rows}
					columns={columns}
					dimension={dimension}
					content={tileContent[i]}
					marker = {marker}
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
						tileboardHeight,
						tileboardWidth,
						loading
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
									loading={loading}
										tileboardHeight={tileboardHeight}
										tileboardWidth={tileboardWidth}
										playAgain={playAgain}
										newGame={newGame}
										picData={data}
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

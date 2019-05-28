import React from "react"
import hiddenBoneStyles from '../styles/hidden-bones.module.css'
import InitGame from "./InitGame"
import Tileboard from "./Tileboard"
import Tile from "./Tile"

const {
	hiddenBonesLanding,
	 gameBoardHolder
	} = hiddenBoneStyles
class HiddenBones extends React.Component{
	constructor(props){
		super(props)
		this.state ={
			initError:"",
			showInitGame: true,
			columns:null,
			rows:null,
			tileLogic:null
		}
		this.startGame = this.startGame.bind(this)
		this.handleAsyncState = this.handleAsyncState.bind(this)
		this.tileLogic = this.tileLogic.bind(this)
		this.generateTiles = this.generateTiles.bind(this)
		this.createBones = this.createBones.bind(this)
	}
	handleAsyncState(attr, data, func){
		this.setState(prevState => {
			prevState[attr] =  data
			return prevState
		}, func)
	}
	startGame(data){
		const {rows, columns} = data
		const validRows = this.truthyQuery(rows)
		const validColumns = this.truthyQuery(columns)
		const intRows = Math.round(parseInt(rows))
		const intColumns = Math.round(parseInt(columns))
		
		if(validRows && validColumns){
			if((intColumns > 3) && (intRows>3) ){
				this.setState(prevState=>{
					prevState.showInitGame = false
					prevState.columns = intColumns
					prevState.rows = intRows
					return prevState
				})

			}else{
			// 	console.log(
			// `startGame,
			// choose numbers greater than 3 for rows and columns
			// `)
				this.setState({ initError: "Please Choose numbers greater than 3 for the initial Rows and Columns"})
			}

		}
	}
	truthyQuery(data){
		return data !== ""
	}
	tileLogic(){
		const {rows, columns} = this.state
		const array = []
		const spaces = rows * columns
		for(let i = 0; i < rows; i++){
			const column = Array(columns).fill(null)
			array.push(column)
		}
		// console.log("populated Array", array)
		this.createBones(spaces)
	}
	generateTiles(){
		// console.log("generateTiles")

		const {rows, columns} = this.state
		const width = 1/columns
		const height = 1/rows
		const widthPercent = (width*100) +"%"
		const heightPercent = (height*100) +"%"
		const dimension = {
			width:widthPercent, 
			height: heightPercent
		};
		const holdsTiles =[]
		const spaces = rows * columns;
		for(let i =0; i < spaces; i++){
			holdsTiles.push(
			<Tile
			key={i} 
			dimension={dimension}
			/>) 
		}
		return holdsTiles
		
	}
	createBones(spaces){
		const halfSpaces = spaces/2
		let boneTotal = 0
		const boneArray = []
		let counter = 2
		while(boneTotal<halfSpaces){
			if(counter > 5){
				counter=2
			}
			if(counter === 2){
				boneTotal += 2
				boneArray.push(2)
			}
			if(counter === 3){
				boneTotal += 3
				boneArray.push(3)
			}
			if(counter === 4){
				boneTotal += 4
				boneArray.push(4)
			}
			if(counter === 5){
				boneTotal += 5
				boneArray.push(5)
			}
			counter++
		}
		boneArray.sort((a, b)=> b-a)
		// this.setState({daBones:boneArray})
		console.log("boneArray", boneArray)
	}
	render(){
		const {
			showInitGame, 
			initError,
			dementions
		} = this.state
		const {
			startGame, 
			handleAsyncState,
			tileLogic,
			generateTiles
		} = this
		return(
		<div className ={hiddenBonesLanding}>
			HiddenBones
			<div className={gameBoardHolder}>
			{showInitGame? 
				<InitGame
				handleAsyncState = {handleAsyncState}
				startGame = {startGame}
				initError = {initError}
				/>: 
				<Tileboard 
				generateTiles = {generateTiles}
				tileLogic = {tileLogic}
				/>
			}

			</div>
		</div>
		)
	}
	
}
export default HiddenBones
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
			tileLogicArray:null
		}
		this.startGame = this.startGame.bind(this)
		this.handleAsyncState = this.handleAsyncState.bind(this)
		this.tileLogic = this.tileLogic.bind(this)
		this.generateTiles = this.generateTiles.bind(this)
		this.createBones = this.createBones.bind(this)
		this.placeBones = this.placeBones.bind(this)
		this.canBoneFitQuery = this.canBoneFitQuery.bind(this)
		this.boneSpaceQuery = this.boneSpaceQuery.bind(this)
		this.addBoneToTileLogic = this.addBoneToTileLogic.bind(this)
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
		this.setState({tileLogicArray: array}, ()=>{
			this.createBones(spaces)
		})
		
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

		console.log("boneArray", boneArray)
		this.placeBones(boneArray)
	}
	placeBones(boneArray){
		const {rows, columns} = this.state
		// const colIndexLimit = columns - 1
		// const rowIndexLimit = rows - 1
		for(let i=0; i < boneArray.length; i++ ){
			
			// const randomRowIndex = this.randomNumber(rowIndexLimit)
			
			let boneFits = false
			let boneSpace = false
			console.log(`FOR loop`)
			while(!boneFits && !boneSpace ){
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

				
				if(boneFits){
					const direction = answerArray[1]
					const addOrSub = answerArray[2]
					 boneSpace = this.boneSpaceQuery(coordinates, boneArray[i], direction, addOrSub)
					 console.log(`BONE FITS BUT...
									boneSpace :
									${boneSpace}`)
					 if(boneSpace){
					 	this.addBoneToTileLogic(coordinates, boneArray[i], direction, addOrSub)
					 }

				}
			}

				console.log(`OUTSIDE while loop`)
		}



	}
	addBoneToTileLogic(coordinates, boneSize, direction, addOrSub){
		const {tileLogicArray} = this.state
		console.log(`WITHIN addBoneToTileLogic :
				tileLogicArray:
				 ${JSON.stringify(tileLogicArray)}`)
		let row = coordinates[0]
		let column = coordinates[1]
			if(direction==='hor'){
				if(addOrSub === 'add'){
				for(let i=0; i<boneSize; i++){
					this.setState(prevState=>{
						prevState.tileLogicArray[row][(column + i)] = boneSize
						console.log(`
							WITHIN addBoneToTileLogic FOR LOOP
							i : ${i}
							tileLogicArray : ${prevState.tileLogicArray}`)
						return prevState
							})
					}
				}	
				if(addOrSub==='sub'){
					for(let i=0; i<boneSize; i++){
						this.setState(prevState=>{
						prevState.tileLogicArray[row][(column -i)] = boneSize
						console.log(`
							WITHIN addBoneToTileLogic FOR LOOP
							i : ${i}
							tileLogicArray : ${prevState.tileLogicArray}`)
						return prevState
							})
					}
				}
			}
			if(direction=== 'vert'){
				if(addOrSub === 'add'){
					for(let i=0; i<boneSize; i++){
						this.setState(prevState=>{
						prevState.tileLogicArray[(row + i)][column] = boneSize
						console.log(`
							WITHIN addBoneToTileLogic FOR LOOP
							i : ${i}
							tileLogicArray : ${prevState.tileLogicArray}`)
						return prevState
						})
					}
				}
				if(addOrSub==='sub'){
					for(let i=0; i<boneSize; i++){
						this.setState(prevState=>{
						prevState.tileLogicArray[(row - i)][column] = boneSize
						console.log(`
							WITHIN addBoneToTileLogic FOR LOOP
							i : ${i}
							tileLogicArray : ${prevState.tileLogicArray}`)
						return prevState
						})
					}
				}
			}
	}
	boneSpaceQuery(coordinates, boneSize, direction, addOrSub){
		const {tileLogicArray} = this.state
		console.log(`WITHIN boneSpaceQuery :
				tileLogicArray:
				 ${JSON.stringify(tileLogicArray)}`)
		let row = coordinates[0]
		let column = coordinates[1]
			if(direction==='hor'){
				if(addOrSub === 'add'){
				for(let i=0; i<boneSize; i++){
					let freeSpaceQuery = tileLogicArray[row][(column + i)]
					console.log(`boneSpaceQuery :
								direction : ${direction}
								addOrSub : ${addOrSub}
							 	freeSpaceQuery : ${freeSpaceQuery}`)
						if(freeSpaceQuery){
							return false// only runs if freeSpaceQuery is not falsy
						}
					}
					return true //only runs if all iterations are null
				}	
				if(addOrSub==='sub'){
					for(let i=0; i<boneSize; i++){
					let freeSpaceQuery = tileLogicArray[row][(column -i)]
					console.log(`boneSpaceQuery :
								direction : ${direction}
								addOrSub : ${addOrSub}
								freeSpaceQuery : ${freeSpaceQuery}`)
						if(freeSpaceQuery){
								return false// only runs if freeSpaceQuery is not falsy
							}
					}
					return true //only runs if all iterations are null
				}

			}
			if(direction=== 'vert'){
				if(addOrSub === 'add'){
					for(let i=0; i<boneSize; i++){
					let freeSpaceQuery = tileLogicArray[(row + i)][column]
					console.log(`boneSpaceQuery :
								direction : ${direction}
								addOrSub : ${addOrSub}
							 	freeSpaceQuery : ${freeSpaceQuery}`)
						if(freeSpaceQuery){
								return false// only runs if freeSpaceQuery is not falsy
							}
					}
					return true //only runs if all iterations are null

				}
				if(addOrSub==='sub'){
					for(let i=0; i<boneSize; i++){
					let freeSpaceQuery = tileLogicArray[(row - i)][column]
					console.log(`boneSpaceQuery :
								direction : ${direction}
								addOrSub : ${addOrSub}
								freeSpaceQuery : ${freeSpaceQuery}`)
					if(freeSpaceQuery){
								return false// only runs if freeSpaceQuery is not falsy
							}
					}
					return true //only runs if all iterations are null

				}
			}
		
	}
	canBoneFitQuery(coordinates, boneSize){
		let vertOrHorizontal = this.randomNumber(2)
		
		const boneAndStartPoint = boneSize - 1
		 const {rows, columns} = this.state
		const colIndexLimit = columns - 1
		const rowIndexLimit = rows - 1
		console.log(`current params
				 Bone Size: 
				${boneSize}
				coordinates : 
				${coordinates}`)
		if(vertOrHorizontal){//if value is 1 direction is vertical
			 let directional = vertOrHorizontal ? "vert" : "hor"
			const addCheck= coordinates[0] + boneAndStartPoint

			if(addCheck <= rowIndexLimit ){
				console.log(`fitCheck 
						true: add
						direction ${directional}
						coordinates ${coordinates}`)
				return [true, directional, "add" ]
			}else{
				const subCheck = coordinates[0] - boneAndStartPoint
				if (subCheck >= 0){
					console.log(`fitCheck 
						true: sub
						direction ${directional}
						coordinates ${coordinates}`)

					return [true, directional, "sub" ]
				}else{
					console.log(`fitCheck
					 false:
					direction ${directional}`)
					return [false, directional]
				}
			}

		}else{
			let directional = vertOrHorizontal ? "vert" : "hor"
			const addCheck= coordinates[1] + boneAndStartPoint
			if(addCheck <= colIndexLimit ){
				console.log(`fitCheck 
						true: add
						direction ${directional}
						coordinates ${coordinates}`)
				return [true, directional, "add" ]
			}else{
				const subCheck = coordinates[1] - boneAndStartPoint
				if (subCheck >= 0){
					console.log(`fitCheck 
						true: add
						direction ${directional}
						coordinates ${coordinates}`)
					return [true, directional, "sub" ]
				}else{
					console.log(`fitCheck 
						false:
					direction ${directional}`)
					return [false]
				}
			}
		}
	}
	randomNumber(number){
		const random = Math.floor( Math.random() * number)
		console.log(`randomNumber : ${random}`)
		return random
	}
	render(){
		const {
			showInitGame, 
			initError
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
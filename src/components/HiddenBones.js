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
			tileLogicArray:null,
			tileContent: [],
			winQuery:false,
			loseQuery:0,
			misses:0,
			initGame:false
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
		this.markTile = this.markTile.bind(this)
		this.checkWin = this.checkWin.bind(this)
		this.addWinArray = this.addWinArray.bind(this)
		this.checkLose = this.checkLose.bind(this)
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
				const spaces = intColumns * intRows
				const contentArray = Array(spaces).fill(`null`)
				const loseQuery = Math.floor(spaces/3)
				this.setState(prevState=>{
					prevState.showInitGame = false
					prevState.columns = intColumns
					prevState.rows = intRows
					prevState.tileContent = contentArray
					prevState.loseQuery = loseQuery
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
		this.setState({tileLogicArray: array, initGame: true}, ()=>{
			console.log("INIT GAME: TRUE")
			this.createBones(spaces)
		})
		
	}
	generateTiles(){
		// console.log("generateTiles")

		const {rows, columns, tileContent} = this.state
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
			// const tileNumber = i+1
			holdsTiles.push(
			<Tile
			key={i} 
			dimension={dimension}
			content = {tileContent[i]}
			handleClick= {()=>this.markTile(i)}
			/>) 
		}
		return holdsTiles
		
	}
	markTile(tile){
		 // console.log(`Tile # ${tile}`)
		 let counter = 0
		 const {rows, columns, tileLogicArray} = this.state
		 for(let rowCount = 0; rowCount < rows; rowCount++){
		 	for(let colCount = 0; colCount < columns; colCount++){
		 			console.log(`current Iteration : 
		 				tile: ${tile}
		 				columns: ${colCount}
		 				rows: ${rowCount}
		 				counter: ${counter}`)

		 		if(counter === tile){
		 			const tileContent = tileLogicArray[rowCount][colCount]
		 			console.log(`tileContent : ${tileContent}`)
		 			return (this.setState(prevState=>{
		 				prevState.tileContent[counter] = tileContent
		 				return prevState
		 			}, ()=>{
		 				this.checkLose()
		 				 const winQuery = this.checkWin()
		 				console.log(`CheckWinCALLBACK ${winQuery}`)

						 if(winQuery){
		 				console.log("You Win!")

						 	this.setState({winQuery:true})
						 }
		 			}))
		 			// console.log(`tile Clicked : ${tile}`)

		 		}
		 		counter++
			 }
		 }
		
	}
	checkLose(){
		const {tileContent} = this.state
		let missCount = 0
		for(let i=0; i < tileContent.length; i++){
			
			if(tileContent[i] === null){
				missCount++
			}
		}
		this.setState({misses:missCount})
	}
	checkWin(){
		const {tileContent, winArray} = this.state
		let nonNullTileContent = []
		for(let i=0; i < tileContent.length; i++){
			if(tileContent[i] !== null){
				nonNullTileContent.push(tileContent[i])
			}
		}
		const array1 = nonNullTileContent
		const array2 = winArray
		if(array1.length !== array2.length){

	        	return false
			}
		for (var i = 0; i < array1.length; i++) {
	        if (array1[i] !== array2[i]){
	        	return false
	        }
            
   		}
   		 return true;
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
			while(((!boneFits) || (!boneSpace))){
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
				console.log(`END OF WHILE LOOP
					boneFits : ${boneFits}
					boneSpace : ${boneSpace}`)
			}

				console.log(`OUTSIDE while loop`)
				this.setState({initGame:false}, ()=> console.log("INIT GAME : FALSE"))
		}



	}
	addBoneToTileLogic(coordinates, boneSize, direction, addOrSub){
		const {tileLogicArray} = this.state
		console.log(`WITHIN addBoneToTileLogic :
				tileLogicArray:
				 ${JSON.stringify(tileLogicArray)}`)
		let row = coordinates[0]
		let column = coordinates[1]
		let logicArray = tileLogicArray

			if(direction==='hor'){
				if(addOrSub === 'add'){
				for(let i=0; i<boneSize; i++){
					logicArray[row][(column + i)] = boneSize
					}
				}	
				if(addOrSub==='sub'){
					for(let i=0; i<boneSize; i++){
					logicArray[row][(column -i)] = boneSize
					}
				}
			}
			if(direction=== 'vert'){
				if(addOrSub === 'add'){
					for(let i=0; i<boneSize; i++){
					logicArray[(row + i)][column] = boneSize
					
					}
				}
				if(addOrSub==='sub'){
					for(let i=0; i<boneSize; i++){
					logicArray[(row - i)][column] = boneSize
					}
				}
			}
			this.setState({tileLogicArray: logicArray}, ()=>{
			this.addWinArray()
			})
	}
	addWinArray(){
		const winArray = []
		const {rows, columns, tileLogicArray} = this.state
		for(let r = 0; r <rows; r++ ){
			for(let c= 0; c<columns; c++){
				if(tileLogicArray[r][c] !== null){
					winArray.push(tileLogicArray[r][c])
				}
			}
		}
		this.setState({winArray})

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
			initError,
			winQuery,
			loseQuery,
			misses,
			initGame
		} = this.state
		const {
			startGame, 
			handleAsyncState,
			tileLogic,
			generateTiles
		} = this
		return(
		<div className ={hiddenBonesLanding}>
			<div className={gameBoardHolder}>
			{showInitGame? 
				<InitGame
				handleAsyncState = {handleAsyncState}
				startGame = {startGame}
				initError = {initError}
				/>: 
				<Tileboard
				initGame = {initGame} 
				loseQuery ={loseQuery}
				misses	= {misses}
				winQuery = {winQuery}
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
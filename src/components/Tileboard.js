import React from "react"
import tileboardStyles from "../styles/tileboard.module.css"
import GameEnd from "./GameEnd"

const {
	tileboard,
	holdsTiles
} = tileboardStyles
class Tileboard extends React.Component{
	constructor(props){
		super(props)
		this.state ={
		}
	}
	componentDidMount(){
		this.props.tileLogic()
	}
	// 
	render(){
		const {
		generateTiles,
		winQuery,
		loseQuery,
		misses,
		initGame,
		picData
	} = this.props
	
		return(
		<div className={tileboard}>
			<div className={holdsTiles}>
			{generateTiles(picData)}
			</div>
			{misses >=loseQuery ?
				<GameEnd 
				newGame={this.props.newGame} 
				endText="You Lose!"
				playAgain={this.props.playAgain}
				/>
				: null }
			{winQuery?<GameEnd 
				newGame={this.props.newGame} 
				endText="You Win!"
				/>: null}
		</div>
		)
	

		
	}
}
export default Tileboard

import React from "react"
import tileboardStyles from "../styles/tileboard.module.css"
import GameEnd from "./GameEnd"
import Loading from "./Loading"

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
		picData,
		tileboardHeight,
		tileboardWidth,
		loading
	} = this.props
	const boardDimension = {width: (tileboardWidth+"px"), height: (tileboardHeight+"px")}
		return(
		<div className={tileboard}>
		{loading? <Loading />: null}
			<div 
			style ={boardDimension} 
			className={holdsTiles}>
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

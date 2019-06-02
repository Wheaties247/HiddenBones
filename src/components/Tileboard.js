import React from "react"
import tileboardStyles from "../styles/tileboard.module.css"

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
		winQuery
	} = this.props
		return(
		<div className={tileboard}>

			<div className={holdsTiles}>
			{generateTiles()}
			</div>
			{winQuery? <h1>You Win!</h1>: null}
		</div>
		)
	}
}
export default Tileboard

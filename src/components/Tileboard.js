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
		generateTiles
	} = this.props
		return(
		<div className={tileboard}>

			<div className={holdsTiles}>
			{generateTiles()}
			</div>
		</div>
		)
	}
}
export default Tileboard

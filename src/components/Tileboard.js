import React from "react"
import tileboardStyles from "../styles/tileboard.module.css"

const {
	tileboard,
	holdsTiles
} = tileboardStyles
const Tileboard = (props) =>{
	const {
		tileLogic,
		generateTiles
	} = props
	tileLogic()
	return(
		<div className={tileboard}>
		Tileboard
			<div className={holdsTiles}>
			{generateTiles()}
			</div>
		</div>
		)
}
export default Tileboard

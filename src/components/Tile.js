import React from "react"

const Tile =(props)=>{
	// const dems = {width: '20%', height: '20%'}
	const {dimension } = props
	return(
		<div 
		style = {dimension }
		className="tile"

		></div>
		)
}
export default Tile
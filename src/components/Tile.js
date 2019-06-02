import React from "react"
import TileContent  from "./TileContent"
const Tile =(props)=>{
	// const dems = {width: '20%', height: '20%'}
	const {dimension, handleClick, content } = props
	return(
		<div 
		onClick={handleClick}
		style = {dimension }
		className="tile"

		>
		<TileContent
		content = {content}
		/>
		</div>
		)
}
export default Tile
import React from "react"
import TileContent  from "./TileContent"
import { StaticQuery, graphql } from "gatsby"



const Tile =(props)=>{
	// const dems = {width: '20%', height: '20%'}
	const {
		dimension, 
		handleClick, 
		content, 
		picData, 
		rows, 
		columns,
		marker } = props
	// console.log("tileProps", props)

	return(
				<div 
				onClick={handleClick}
				// style = {dimension }
				className="tile"

				>

				<TileContent
				marker= {marker}
				rows={rows}
				columns={columns}
				image ={picData}
				content = {content}
				/>
				</div>
		
		)
}
export default Tile

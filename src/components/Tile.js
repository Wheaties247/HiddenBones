import React from "react"
import TileContent  from "./TileContent"
import { StaticQuery, graphql } from "gatsby"



const Tile =(props)=>{
	// const dems = {width: '20%', height: '20%'}
	const {dimension, handleClick, content, picData } = props

	return(
				<div 
				onClick={handleClick}
				style = {dimension }
				className="tile"

				>

				<TileContent
				image ={picData}
				content = {content}
				/>
				</div>
		
		)
}
export default Tile

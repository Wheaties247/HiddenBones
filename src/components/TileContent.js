import React from "react"
import Img from "gatsby-image"


const TileContent =(props)=>{
	const {content, image} = props
	const {dogBone, dinoSkull, skull, fish} = image
	const renderImage = mark =>{
		switch(mark){
			case 2:
			return (
				<Img 
				fluid ={dogBone.childImageSharp.fluid} 
				alt = "bone"
				/>
				)
			break;
			case 3:
			return (
				<Img 
				fluid ={fish.childImageSharp.fluid} 
				alt = "fish"
				/>
				)
			break;
			case 4:
			return (
				<Img 
				fluid ={skull.childImageSharp.fluid} 
				alt = "skull"
				/>
				)
			break;
			case 5:
			return (
				<Img 
				fluid ={dinoSkull.childImageSharp.fluid} 
				alt = "dinoSkull"
				/>
				)
			break;
		}
	}

	if(content===`unclicked`){
		return (
			<div className= "holdsContent">
			{ null}
			</div>
			)
	}
	if(content){
		return (
			<div className= "holdsContent">

			{renderImage(content)}
			</div>

			)
	}
	if(content===null){
		return (
			<div className= "holdsContent">

				<div className="hole">
				Miss
				</div>
			</div>
			)
	}

}
export default TileContent
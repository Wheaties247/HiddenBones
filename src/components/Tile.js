import React from "react"
import TileContent  from "./TileContent"
import { StaticQuery, graphql } from "gatsby"



const Tile =(props)=>{
	// const dems = {width: '20%', height: '20%'}
	const {dimension, handleClick, content } = props

	return(
		<StaticQuery 
		query={
			graphql`{ 
				dogBone: file(relativePath: {eq: "dogBone.png"}){
				    childImageSharp{
				      fluid(maxWidth:900){
				        ...GatsbyImageSharpFluid
				      }
				    }
				  }
				dinoSkull: file(relativePath: {eq: "dinoSkull.png"}){
		 		    childImageSharp{
 		     		  fluid(maxWidth:900){
 		        	   ...GatsbyImageSharpFluid
	 		          }
		   		    }
		   		  }
		   		skull: file(relativePath: {eq: "skull.png"}){
		   	 		childImageSharp{
		      		  fluid(maxWidth:900){
		       		   ...GatsbyImageSharpFluid
		 		      }
				    }
				  }
				fish: file(relativePath: {eq: "fish.png"}){
			    	childImageSharp{
			      	  fluid(maxWidth:900){
			           ...GatsbyImageSharpFluid
				      }
				    }
				  }
		}`

		}  
		render={(data)=>(
				<div 
				onClick={handleClick}
				style = {dimension }
				className="tile"

				>

				<TileContent
				image ={data}
				content = {content}
				/>
				</div>
						)
				} />
		
		)
}
export default Tile
// { dogBone: file(relativePath: {eq: "dogBone.png"}){
// 		    childImageSharp{
// 		      fluid(maxWidth:1600){
// 		        ...GatsbyImageSharpFluid
// 		      }
// 		    }
// 		  }
// 		  { dinoSkull: file(relativePath: {eq: "dinoSkull.png"}){
// 		    childImageSharp{
// 		      fluid(maxWidth:1600){
// 		        ...GatsbyImageSharpFluid
// 		      }
// 		    }
// 		  }
// 		  { skull: file(relativePath: {eq: "skull.png"}){
// 		    childImageSharp{
// 		      fluid(maxWidth:1600){
// 		        ...GatsbyImageSharpFluid
// 		      }
// 		    }
// 		  }
// 		  { fish: file(relativePath: {eq: "fish.png"}){
// 		    childImageSharp{
// 		      fluid(maxWidth:1600){
// 		        ...GatsbyImageSharpFluid
// 		      }
// 		    }
// 		  }
// 			}
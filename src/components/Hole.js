import React from "react"
import styles from "../styles/hole.module.css"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const { background, outerHole, innerHole, container, imageContainer } = styles
const Hole = props => (
	<StaticQuery
		query={graphql`
			{
				hole: file(relativePath: { eq: "sink.png" }) {
					childImageSharp {
						fluid(maxWidth: 1000) {
							...GatsbyImageSharpFluid
						}
					}
				}
			}
		`}
		render ={data=>{
			console.log("data", data)
			const {hole} = data
			return(
			<div className={container}>
				<div className={imageContainer}>
					<Img fluid={hole.childImageSharp.fluid} alt="hole" />
				</div>	
			</div>
				)
		}}/>
	
)
export default Hole

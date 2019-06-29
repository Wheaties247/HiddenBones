import React from "react"
import styles from "../styles/hole.module.css"
import { StaticQuery, graphql } from "gatsby"
import Img from "gatsby-image"

const { background, outerHole, innerHole, container } = styles
const Hole = props => (
	<StaticQuery
		query={graphql`
			{
				hole: file(relativePath: { eq: "hole.png" }) {
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
					<Img fluid={hole.childImageSharp.fluid} alt="hole" />
				</div>
				)
		}}/>
	
)
export default Hole

import React from "react"
import buttonStyle from '../styles/button.module.css'

const {buttonDimentions, buttonText} = buttonStyle
const Button =(props) =>{
	const {children, handleClick} = props

	return(
		<div 
		className = {buttonDimentions}
		onClick = {handleClick}
		>
			<h4 className={buttonText}>
				{children}
			</h4>
		</div>
	)
}

export default Button
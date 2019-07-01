import React from "react"
import styles from "../styles/gameEnd.module.css"
import Button from "./Button"
const {container, title, buttonContainer} = styles
const GameEnd = props => {
	const {endText, newGame, playAgain} = props


	return(
		<div className = {container}>
		<p className={title}>{endText}</p>
		<div className= {buttonContainer}>
			<Button handleClick={playAgain}>Play Again</Button>
			<Button handleClick={newGame}>New Game</Button>
		</div>
		

		</div>
		)

}

export default GameEnd
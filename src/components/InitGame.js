import React from "react"
import Button from "./Button"

class InitGame extends React.Component{
	constructor(props){
		super(props)
		this.state ={
			rows:"",
			columns:""
		}
		this.handleChange = this.handleChange.bind(this);
		this.gameCreds = this.gameCreds.bind(this);
	}
	handleChange(event){
		// console.log("handleChange", event.target.name)
		const target = event.target.value
		const name = event.target.name
		this.setState({
			[name]: target
		})
	}
	gameCreds(){
		// this.props.handleAsyncState("initError", "",
		// ()=>setTimeout(, 1000) )
		this.props.startGame(this.state)
	}
	render(){
		const {rows, columns} = this.state
		// const {} = this.props
		const {handleChange, gameCreds} = this
		return(
		<div className="initGame">
			<form>
			InitGame
				<label htmlFor="columns">
				   Select number of columns:
				   <input 
				   id = "columns"
				   name = "columns"
				   type = "number" 
				   onChange= {handleChange}
				   />
				 </label>
				 <label htmlFor="rows">
				   Select number of rows:
				   <input 
				   id = "rows"
				   name = "rows"
				   type = "number" 
				   onChange= {handleChange}
				   />
				 </label>
				 {this.props.initError===""? null: this.props.initError}
				<Button
				handleClick={gameCreds}
				>
				Start Game
				</Button>
			</form>
		</div>
		)
	}
	
}

export default InitGame
// <input 
// 				   type="text" 
// 				   pattern="[0-9]*" 
// 				   onInput={this.handleChange} 
// 				   value={this.state.columns}
// 				   />
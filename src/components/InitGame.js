import React from "react"
import Button from "./Button"
import Loading from "./Loading"

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
		// const {handleAsyncState, startGame} = this.props
		// handleAsyncState(`initGame`, true , startGame(this.state))
		// ()=>setTimeout(, 1000) )
		this.props.startGame(this.state)
	}
	render(){
		// const {rows, columns} = this.state
		// const {} = this.props
		const {handleChange, gameCreds} = this
		return(
		<div className="initGame">
			<form>
				<label htmlFor="columns">
				   Select number of rows:
				   <input 
				   id = "columns"
				   name = "columns"
				   type = "number" 
				   onChange= {handleChange}
				   />
				 </label>
				 <label htmlFor="rows">
				   Select number of columns:
				   <input 
				   id = "rows"
				   name = "rows"
				   type = "number" 
				   onChange= {handleChange}
				   />
				 </label>
				 {this.props.initError===""? null: <p className="errorMsg">{this.props.initError}</p>}
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
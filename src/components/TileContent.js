import React from "react"

const TileContent =(props)=>{
	const {content} = props
	if(content===`null`){
		return ""
	}
	if(content){
		return <div>{content}</div>
	}
	if(content===null){
		return <div>Miss</div>
	}

}
export default TileContent
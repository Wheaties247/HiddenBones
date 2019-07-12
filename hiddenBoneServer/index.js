const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 7770;

// const bonelogic = require("./bonelogic/boneLogic.js")

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

const bonelogic = require("./boneLogic/boneLogic.js");

app.post('/logic/:rows/:columns',
		 bonelogic.tileLogic,
		 bonelogic.createBones, 
		 bonelogic.placeBones,
		 bonelogic.addWinArray,
		 (req, res, next)=>{
	console.log("request complete")

	res.json({
		tileLogicArray : res.locals.newLogicArray,
		winArray : res.locals.bonesToGo
	})
})



app.listen(PORT, () => console.log("Hidden Bones Server listening on port", PORT ));

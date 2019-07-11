const boneLogic = {};

boneLogic.tileLogic = (req, res, next) =>{
	console.log("req.params", req.params)
	const rows = req.params.rows
	const columns = req.params.columns

	// console.log("req", req)

	// const rows = req.params
    next();

}

module.exports = boneLogic;

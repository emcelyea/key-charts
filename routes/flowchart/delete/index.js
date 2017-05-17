/*
	Flowchart DELETE function
*/
module.exports = function(Schema, Controller){
	
	return function(req,res,next){
		if (req.params.flowchart) {
			Controller.delete(req.params.flowchart, (err, success) =>{
				if(err){
					res.status(400);
					res.send(err);
				}else{
					res.status(200);
					res.send(success);
				}
			});
		} else {
			res.status(400);
			res.send('missing flowchart param');
		}
	}
}
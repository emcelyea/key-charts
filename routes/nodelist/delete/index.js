/*
	Nodelist DELETE function
*/

module.exports = function(Schema, Controller){
	
	return function(req,res,next){
		if(req.params.nodelist){
			Controller.delete(req.params.nodelist, (err, success) => {
				if(err){
					res.status(400);
					res.send(err);
				}else{
					res.status(200);
					res.send(success);
				}
			});
		}else{
			res.status(400);
			res.send('missing nodelist param');
		}
	}
}
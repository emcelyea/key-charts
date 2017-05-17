/*
 *	team DELETE function
 */
module.exports = function(Schema){
	
	return function(req,res,next){
		if(req.params.team){
			Schema.remove({_id:req.params.team}, function(err, team){
				if(err){
					res.status(400);
					res.send(err);
				}else{
					res.status(200);
					res.send(team);
				}
			});
		}else{
			res.status(400);
			res.send('Missing parameters to delete team');
		}


	}
}
/*
 *	Gantt POST function
 */
module.exports = function(Schema){
	
	return function(req,res,next){
		if(req.params.team && (req.body.color || req.body.name) ){
			Schema.find({_id:req.params.team}, function(err, team){
				if(team.length === 1){
					team = team[0];
				}else{
					res.status(400);
					return res.send('Weird team bug');
				}
				if(req.body.color){
					team.color = req.body.color;
				}
				if(req.body.name){
					team.name = req.body.name;
				}
				team.save(function(err, success){
					if(err){
						res.status(400);
						res.send(err);
					}else{
						res.status(200);
						res.send(success);
					}
				});	
			});
		}else{
			res.status(400);
			res.send('Missing parameters to update team');
		}


	}
}
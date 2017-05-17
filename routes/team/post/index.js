/*
 *	Gantt POST function
 */
module.exports = function(Schema){
	
	return function(req,res,next){
		if(req.body.name && req.body.color && req.body.gantt){
			Schema.create(req.body, function(err, success){
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
			res.send('Missing parameters to create team');
		}


	}
}
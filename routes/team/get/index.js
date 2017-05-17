/*
 *	Gantt POST function
 */
module.exports = function(Schema){
	
	return function(req, res, next){
		if(req.query.gantt){
			Schema.find({gantt:req.query.gantt}, function(err, teams){
				if(err){
					res.status(400);
					res.send(err);
				}else{
					res.status(200);
					res.send(teams);
				}
			});
		}else{
			res.status(400);
			res.send('Missing parameters to get teams');
		}


	}
}
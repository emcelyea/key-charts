/*
 *	team DELETE function
 */
module.exports = function(Schema){
	
	return function(req,res,next){
		if(req.params.gantt){
			Schema.remove({_id:req.params.gantt}, function(err, success){
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
			res.send('Missing parameters to delete gantt');
		}


	}
}
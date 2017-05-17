/*
	Task Delete by _id function
*/
module.exports = function(Schema){
	
	return function(req,res,next){
		if(req.params.task){
			var query = {_id:req.params.task.toString()};
			Schema.remove(query, function(err, success){
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
			res.send('Missing querystring for delete');
		}
	}
}

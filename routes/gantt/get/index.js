/*
	Gantt Get function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		var query = {_id:req.body._id.toString()};
		Schema.find(query, function(err, success){
			if(err){
				res.status(400);
				res.send(err);
			}else{
				res.status(200);
				res.send(success);
			}
		});
	}
}

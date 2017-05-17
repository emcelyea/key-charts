/*
	Flowchart POST function
*/

module.exports = function(Schema, Controller, sanitize){
	
	return function(req,res,next){
		var dirty = sanitize(req);
		if(!dirty){
			var node = req.body;
			Schema.create(node, function(err, success){
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
			res.send(dirty);
		}
	}
}
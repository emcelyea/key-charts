/*
	Node PUT function
*/
module.exports = function(Schema, Controller){
	
	return function(req,res,next){
		var dirty = sanitize(req);
		if(req.params.Node && !dirty){
			Schema.find({_id:req.params.node}, (err, node) => {
				if(err){
					res.status(400);
					res.send(err);
				} else {
					var node = node[0];
					for(var x in node){
						if(req.body[x]){
							node[x] = req.body[x];
						}
					}
					node.save((err,success) =>{
						if(err){
							res.status(400);
							res.send(err);
						}else{
							res.status(200);
							res.send(success);
						}
					});
				}
			});
		} else {
			res.status(400);
			res.send('put node missing params or, ' + dirty);
		}
	}
}

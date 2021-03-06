/*
	Flowchart POST function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		if(req.body && req.body.flowchart){
			var nodelist = {flowchart:req.body.flowchart};
			Schema.create(flowchart, function(err, success){
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
			res.send('missing field flowchart');
		}
	}
}
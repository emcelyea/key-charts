/*
	Flowchart PUT function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		if(req.params.flowchart && req.body){
			Schema.find({_id:req.params.flowchart}, (err, flowchart) => {
				if(err){
					res.status(400);
					res.send(err);
				} else {
					var chart = flowchart[0];
					for(var x in chart){
						if(req.body[x]){
							chart[x] = req.body[x];
						}
					}
					chart.save((err,success) =>{
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
			res.send('missing params or body');
		}
	}
}

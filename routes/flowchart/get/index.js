/*
	Flowchart GET function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		if (req.params.flowchart) {
			Schema.find({_id:req.params.flowchart}, (err, flowchart) => {
				if(err){
					res.status(400);
					res.send(err);
				} else {
					res.status(200);
					res.send(flowchart[0]);
				}
			});
		}else{
			res.status(400);
			res.send('missing params for get flowchart');
		}
	}
}
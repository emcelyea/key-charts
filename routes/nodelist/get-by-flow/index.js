/*
	Nodelist GET by flowchart _id function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		if(req.params.flowchart){
			Schema.find({flowchart:req.params.flowchart}, (err, nodelist) => {
				if(err){
					res.status(400);
					res.send(err);
				} else {
					res.status(200);
					res.send(nodelist[0]);
				}
			});
		}else{
			res.status(400);
			res.send('missing params for get by flow nodelist');
		}
	}
}
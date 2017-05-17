/*
	Flowchart GET function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		if (req.params.node) {
			Schema.find({_id:req.params.node}, (err, node) => {
				if(err){
					res.status(400);
					res.send(err);
				} else {
					res.status(200);
					res.send(node[0]);
				}
			});
		}else{
			res.status(400);
			res.send('missing params for get node');
		}
	}
}
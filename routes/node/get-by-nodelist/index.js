/*
	Flowchart GET function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		if (req.params.nodelist) {
			Schema.find({nodelist:req.params.nodelist}, (err, nodes) => {
				if(err){
					res.status(400);
					res.send(err);
				} else {
					res.status(200);
					res.send(nodes);
				}
			});
		}else{
			res.status(400);
			res.send('missing params for get node by nodelist');
		}
	}
}
/*
	Nodelist GET by nodelist function
*/

module.exports = function(Schema, Controller){
	
	return function(req,res,next){
		if(req.params.nodelist){
			Controller.read(req.params.nodelist, (err, nodelist) => {
				if(err){
					res.status(400);
					res.send(err);
				} else {
					res.status(200);
					res.send(nodelist);
				}
			});
		}else{
			res.status(400);
			res.send('missing params for get nodelist');
		}
	}
}
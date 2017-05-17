/*
	Task Get by _id function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		var query = {};
		if(req.query.task){
			query._id = req.query.task.toString();
		}else if(req.query.gantt){
			query.gantt = req.query.gantt.toString();
		}else if(!req.query.task && !req.query.gantt){
			res.status(400);
			res.send('Missing querystring');
			return;
		}
		
		Schema.find(query, function(err, success){
			if(err){
				res.status(400);
				res.send(err);
			}else{
				res.status(200);
				res.send(success[0]);
			}
		});
	}
}

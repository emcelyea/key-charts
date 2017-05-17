/*
	Gantt POST function
*/

module.exports = function(Schema){
	
	return function(req,res,next){
		var timeperiod = {
							gantt:req.body.gantt.toString(),
							startTime:Number(req.body.startTime),
							endTime:Number(req.body.startTime)
						};
		
		Schema.create(timeperiod, function(err, success){
			if(err){
				res.status(400);
				res.send(err);
			}else{
				res.status(200);
				res.send(success);
			}
		});
	}
}